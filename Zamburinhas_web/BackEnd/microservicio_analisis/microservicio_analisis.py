from flask import Flask, request, jsonify, Response
import numpy as np
import flask
from flask_cors import CORS
import requests 

Response.charset= 'utf-8'
app = Flask(__name__)
CORS(app)
centrales_dict = {}
distancias_dict = {}
precios_dict ={}
events_dict = {}
climatology_dict = {}
hidroelectrica_dict = {}
demand_dict = {}
dia_inicial = "01/01/2030"
centrales = []

def init():
    global lista
    global centrales_dict
    global distancias_dict
    global precios_dict
    global events_dict
    global climatology_dict
    global hidroelectrica_dict
    global demand_dict
    global centrales
    centrales_dict = {}
    distancias_dict = {}
    precios_dict ={}
    events_dict = {}
    climatology_dict = {}
    hidroelectrica_dict = {}
    demand_dict = {}
    centrales = []
    lista = requests.get("http://localhost:8081/list").json()
    for item in lista:
        if "SUN" in item:            
            central = requests.get("http://localhost:8082/item/"+item).json()
            centrales_dict[item] = central[item]
            centrales_dict[item]["maxima_produccion"] = 0
            centrales_dict[item]["coste_energia"] = 0
            centrales_dict[item]["coste_temporal"] = 0
            centrales_dict[item]["produccion_actual"] = 0
        elif "WIN" in item:
            central = requests.get("http://localhost:8083/item/"+item).json()
            centrales_dict[item] = central[item]
            centrales_dict[item]["maxima_produccion"] = 0
            centrales_dict[item]["coste_temporal"] = 0
            centrales_dict[item]["coste_energia"] = 0
            centrales_dict[item]["produccion_actual"] = 0
        elif "WAT" in item:
            central = requests.get("http://localhost:8084/item/"+item).json()
            centrales_dict[item] = central[item]
            centrales_dict[item]["maxima_produccion"] = 0
            centrales_dict[item]["coste_temporal"] = 0
            centrales_dict[item]["coste_energia"] = 0
            centrales_dict[item]["produccion_actual"] = 0
        elif "GEO" in item:
            central = requests.get("http://localhost:8085/item/"+item).json()
            centrales_dict[item] = central[item]
            centrales_dict[item]["maxima_produccion"] = 0
            centrales_dict[item]["coste_temporal"] = 0
            centrales_dict[item]["coste_energia"] = 0
            centrales_dict[item]["produccion_actual"] = 0
        elif "COAL" in item:
            central = requests.get("http://localhost:8086/item/"+item).json()
            centrales_dict[item] = central[item]
            centrales_dict[item]["maxima_produccion"] = 0
            centrales_dict[item]["coste_temporal"] = 0
            centrales_dict[item]["coste_energia"] = 0
            centrales_dict[item]["produccion_actual"] = 0
        if "A0" not in item:
            centrales.append(item)

def analisis():
    init()
    global distancias_dict
    global hidroelectrica_dict
    global demand_dict
    global climatology_dict
    global events_dict
    distancias_dict = requests.get("http://localhost:4000/getDistancias").json()
    hidroelectrica_dict = requests.get("http://localhost:4000/getHidroelectricas").json()
    demand_dict = requests.get("http://localhost:4000/getDemanda").json()
    climatology_dict = requests.get("http://localhost:4000/getClimatologia").json()
    events_dict = requests.get("http://localhost:4000/getEventos").json()

    areas_seleccionadas = request.args.get('areas')
    centrales_seleccionadas = request.args.get('centrales')
    fechas_seleccionadas = request.args.get('fechas')
    if (areas_seleccionadas and centrales_seleccionadas and fechas_seleccionadas):
        areas_seleccionadas = areas_seleccionadas.split(",")
        centrales_seleccionadas = centrales_seleccionadas.split(",")
        fechas_seleccionadas = fechas_seleccionadas.split("-")
    else:
        return {"mensaje":"fechas_no_correctas"}
    fechas_seleccionadas_list = []
    mes_fin = int(fechas_seleccionadas[1].split("/")[1])
    mes_inicio = int(fechas_seleccionadas[0].split("/")[1])
    dia_fin = int(fechas_seleccionadas[1].split("/")[0])
    dia_inicio = int(fechas_seleccionadas[0].split("/")[0])
    rango = mes_fin*31+dia_fin - mes_inicio*31-dia_inicio + 1
    mes_offset = 0 
    dia_offset = 0
    dia = ""
    mes = ""
    for i in range(rango):
        
        dia_int = dia_inicio + dia_offset
        dia_offset += 1
        if (dia_int > 31):
            mes_offset += 1
            dia_int = 0
        if (dia_int < 10):
            dia = "0" + str (dia_int)
        else:
            dia = str(dia_int)
        mes_int = mes_inicio + mes_offset
        if (mes_int < 10):
            mes = "0" + str (mes_int)
        else:
            mes = str(mes_int)
        fechas_seleccionadas_list.append(dia+"/"+mes+"/2030")
        if (mes == mes_fin and dia_int == dia_fin):
            break
    centrales_activas_costes = {"SUN001":0,"SUN002":0,"WIND002":0,"SUN003":0,"WIND003":0,"WAT002":0,"WAT001":0,"GEO001":0,"GEO002":0,"WIND001":0,"COAL001":0}
    centrales_activas = {"SUN001":0,"SUN002":0,"WIND002":0,"SUN003":0,"WIND003":0,"WAT002":0,"WAT001":0,"GEO001":0,"GEO002":0,"WIND001":0,"COAL001":0}
    centrales_activas_array =  {"SUN001":[],"SUN002":[],"WIND002":[],"SUN003":[],"WIND003":[],"WAT002":[],"WAT001":[],"GEO001":[],"GEO002":[],"WIND001":[],"COAL001":[]}
    costes = []
    dias = []
    residencial_list = []
    servicios_list = []
    industrial_list = []
    pantano1 = []
    pantano2 = []
    centrales_activas_list = []
    emisiones_carbon_list = []
    emisiones_sistema_list = []
    for index in range(len(demand_dict)):
        dia = demand_dict[index]["fecha"]
        if (dia not in fechas_seleccionadas_list):
            continue
        demand = demand_dict[index]["centrales"][0]
        hidroelectrica = hidroelectrica_dict[index]["centrales"][0]
        climatology = climatology_dict[index]["centrales"][0]
        wat002 = hidroelectrica["WAT002"]
        wat001 = hidroelectrica["WAT001"]
        for evento_grande in events_dict:
            if dia in evento_grande["fecha"]:
                for central,evento in evento_grande["centrales"][0].items():
                    if "START_MAINTENANCE" in evento["Event Type"]:
                        if central in centrales:
                            centrales.remove(central)
                    elif "END_MAINTENANCE" in evento["Event Type"]:
                        centrales.append(central)
                    elif "DANA" in evento["Event Type"]:
                        if central == "WAT001":
                            wat001["River contribution"] += evento["Volume"]
                        else:
                            wat002["River contribution"] += evento["Volume"]
        centrales_dict["WAT002"]["nivel_inicial"]+= max(0,wat002["River contribution"] - wat002["Consumption"]*1 + float(climatology["WAT002"]["PREC"].replace(",","."))*centrales_dict["WAT002"]["superficie"]/(10000*1000000))
        centrales_dict["WAT001"]["nivel_inicial"]+= max(0,wat001["River contribution"] - wat001["Consumption"]*1 + float(climatology["WAT001"]["PREC"].replace(",","."))*centrales_dict["WAT001"]["superficie"]/(10000*1000000))
        if centrales_dict["WAT001"]["nivel_inicial"] >= 0.95*centrales_dict["WAT001"]["capacidad_total"]:
            centrales_dict["WAT001"]["nivel_inicial"] = centrales_dict["WAT001"]["capacidad_total"]*0.8
        if centrales_dict["WAT002"]["nivel_inicial"] >= 0.95*centrales_dict["WAT002"]["capacidad_total"]:
            centrales_dict["WAT002"]["nivel_inicial"] = centrales_dict["WAT002"]["capacidad_total"]*0.8
        
        for central in centrales_dict:
            if "SUN" in central:            
                radiacion = float(climatology[central]["RADMED"].replace(",","."))
                if (radiacion  <= 150):
                    centrales_dict[central]["maxima_produccion"] = centrales_dict[central]["baja"]*2
                elif (radiacion  >= 150 and radiacion < 225):
                    centrales_dict[central]["maxima_produccion"] = centrales_dict[central]["media"]*2
                else:
                    centrales_dict[central]["maxima_produccion"] = centrales_dict[central]["alta"]*2
                centrales_dict[central]["coste_temporal"] = centrales_dict[central]["maxima_produccion"]
                centrales_dict[central]["coste_energia"] = centrales_dict[central]["maxima_produccion"]*12*1000*centrales_dict[central]["coste_generacion"]/100
            elif "WIN" in central:
                viento = float(climatology[central]["VVMED"].replace(",","."))
                if (viento  <= 0.5):
                    centrales_dict[central]["maxima_produccion"] = centrales_dict[central]["leve"]*24
                elif (viento  >= 0.5 and viento < 1.5):
                    centrales_dict[central]["maxima_produccion"] = centrales_dict[central]["moderado"]*24
                else:
                    centrales_dict[central]["maxima_produccion"] = centrales_dict[central]["fuerte"]*24
                centrales_dict[central]["coste_temporal"] = centrales_dict[central]["maxima_produccion"]
                centrales_dict[central]["coste_energia"] = centrales_dict[central]["maxima_produccion"]*24*1000*centrales_dict[central]["coste_generacion"]/100
            elif "WAT" in central:
                centrales_dict[central]["maxima_produccion"] = (max(centrales_dict[central]["nivel_inicial"]-centrales_dict[central]["capacidad_total"]*0.4,0))*centrales_dict[central]["ratio"]
                centrales_dict[central]["coste_energia"] = centrales_dict[central]["maxima_produccion"]*24*1000*centrales_dict[central]["coste_generacion"]/100
                centrales_dict[central]["coste_temporal"] = centrales_dict[central]["maxima_produccion"]
            elif "GEO" in central:
                temp = float(climatology[central]["TMED"].replace(",","."))
                if (temp  <= 10):
                    centrales_dict[central]["maxima_produccion"] = centrales_dict[central]["baja"]*24
                elif (temp  >= 10 and temp < 25):
                    centrales_dict[central]["maxima_produccion"] = centrales_dict[central]["media"]*24
                else:
                    centrales_dict[central]["maxima_produccion"] = centrales_dict[central]["alta"]*24
                centrales_dict[central]["coste_temporal"] = centrales_dict[central]["maxima_produccion"]
                centrales_dict[central]["coste_energia"] = centrales_dict[central]["maxima_produccion"]*24*1000*centrales_dict[central]["coste_generacion"]/100
            elif "COAL" in central:
                
                centrales_dict[central]["maxima_produccion"] = centrales_dict[central]["generacion"]
                emisiones_carbon = 0
                centrales_dict[central]["coste_temporal"] = centrales_dict[central]["maxima_produccion"]
                centrales_dict[central]["coste_energia"] = centrales_dict[central]["maxima_produccion"]*24*1000*centrales_dict[central]["coste_generacion"]/100
        orden = ["SUN001","SUN002","WIND002","SUN003","WIND003","WAT002","WAT001","GEO001","GEO002","WIND001","COAL001"]
        emisiones_sistema = 0
        emisiones_carbon = 0
        coste = 0
        penalizacion_industrial = 0
        penalizacion_residencial = 0
        penalizacion_servicios = 0
        
        for i in range(1,96):
            j = str(i) if i >= 10 else "0" + str(i)
            area = "A0" + j
            if area not in areas_seleccionadas:
                continue
            minimo = {"central":"","area":area,"coste":999999999999999999999999999999999999999999999,"industrial":9999999999999999999999,"servicios":99999999999999999,"residencial":999999999999999999}
            demanda = float(demand[area]["Total"].replace(",","."))*1.8
            for central in orden:
                distancia_area = 99999999999999999999999
                for area_info in distancias_dict[0][central]:
                    if (area_info[0] == area):
                        distancia_area = area_info[1]
                        break
                if (central not in centrales or centrales_dict[central]["maxima_produccion"] - centrales_dict[central]["produccion_actual"] < demanda or central not in centrales_seleccionadas):
                    continue
                industrial = float(demand[area]["Industry"].replace(",","."))*centrales_dict[central]["penalizacion_industrial"]
                servicios = float(demand[area]["Services"].replace(",","."))*centrales_dict[central]["penalizacion_servicios"]
                residencial = float(demand[area]["Residential"].replace(",",".").replace("a",""))*centrales_dict[central]["penalizacion_residencial"]
                coste_produccion = (demanda*centrales_dict[central]["coste_energia"])/centrales_dict[central]["maxima_produccion"]
                coste_transporte = demanda*coste_produccion+distancia_area*centrales_dict[central]["coste_transporte"]
                coste_total = coste_transporte + coste_produccion
                if coste_total < minimo["coste"]:
                    minimo = {"central":central,"area":area,"coste":coste_total,"industrial":industrial,"servicios":servicios,"residencial":residencial}
                elif coste_total  == minimo["coste"]:
                    if industrial < minimo["industrial"]:
                        minimo = {"central":central,"area":area,"coste":coste_total,"industrial":industrial,"servicios":servicios,"residencial":residencial}
                    elif industrial < minimo["servicios"]:
                        minimo = {"central":central,"area":area,"coste":coste_total,"industrial":industrial,"servicios":servicios,"residencial":residencial}
                    elif industrial < minimo["residencial"]:
                        minimo = {"central":central,"area":area,"coste":coste_total,"industrial":industrial,"servicios":servicios,"residencial":residencial}
                elif len(minimo["area"]) == 0:
                    minimo = {"central":central,"area":area,"coste":coste_total,"industrial":industrial,"servicios":servicios,"residencial":residencial}
            centrales_dict[central]["produccion_actual"] += demanda
            centrales_activas_costes[minimo["central"]] += minimo["coste"]
            coste += minimo["coste"]
            penalizacion_industrial += minimo["industrial"]
            penalizacion_residencial += minimo["residencial"]
            penalizacion_servicios += minimo["servicios"]
            emisiones_carbon += centrales_dict["COAL001"]["emisiones"]*demanda
            emisiones_sistema += centrales_dict[minimo["central"]]["emisiones"]*demanda
            centrales_activas[minimo["central"]] += demanda
        for key in centrales_activas_costes.keys():
            if (key in centrales_activas_costes):
                centrales_activas_array[key].append(centrales_activas_costes[key])
            else:
                centrales_activas_array[key].append(0)
        costes.append([dia,coste])
        industrial_list.append(penalizacion_industrial)
        servicios_list.append(penalizacion_servicios)
        residencial_list.append(penalizacion_residencial)
        emisiones_carbon_list.append(emisiones_carbon)
        emisiones_sistema_list.append(emisiones_sistema)
        dias.append(dia)
        pantano1.append(centrales_dict["WAT001"]["nivel_inicial"])
        pantano2.append(centrales_dict["WAT002"]["nivel_inicial"])
        centrales_activas_list = [[key,value] for key,value in centrales_activas.items()if value !=0]
        
    retorno = {"emisiones":[dias,emisiones_carbon_list,emisiones_sistema_list],"niveles_pantanos":[pantano1,pantano2],"penalizaciones":[industrial_list,servicios_list,residencial_list],"costes":costes,"centrales_activas":centrales_activas_list,"costes_diarios":centrales_activas_array}
    return retorno

                
@app.route('/', methods=["GET"])
def datos():
    # request.json
    return jsonify(analisis())

@app.route('/list', methods=["GET"])
def list():
    return jsonify(requests.get("http://localhost:8081/list").json())

@app.route('/item', methods=["GET"])
def items():
    item = request.args.get('item')
    if ("SUN" in item):
        return jsonify(requests.get("http://localhost:8082/item/"+item).json())
    elif ("WIN" in item):
        return jsonify(requests.get("http://localhost:8083/item/"+item).json())
    elif ("WAT" in item):
        return jsonify(requests.get("http://localhost:8084/item/"+item).json())
    elif ("GEO" in item):
        return jsonify(requests.get("http://localhost:8085/item/"+item).json())
    elif ("COA" in item):
        return jsonify(requests.get("http://localhost:8086/item/"+item).json())
        
if __name__ == '__main__':
    from waitress import serve
    
    print("INICIADO")
    serve(app, host="0.0.0.0", port=3334)
    
    
    # app.run(host='0.0.0.0', port=5000)


