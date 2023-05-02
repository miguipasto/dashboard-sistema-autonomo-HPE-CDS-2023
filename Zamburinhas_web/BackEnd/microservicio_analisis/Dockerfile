FROM python:3.9-slim

WORKDIR /app/microservicio_red_neuronal

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD ["python3", "microservicio_analisis.py"]