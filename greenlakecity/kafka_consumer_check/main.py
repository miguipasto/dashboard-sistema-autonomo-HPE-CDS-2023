from kafka import KafkaConsumer
import os
import time

KAFKA_SERVERS = f"{os.environ.get('KAFKA_HOST')}:{os.environ.get('KAFKA_PORT')}"

time.sleep(25)

consumer = KafkaConsumer(
    'weather',
    bootstrap_servers=[KAFKA_SERVERS],
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    auto_commit_interval_ms= 1000,
    group_id='greenlake-checker-group'
)

for message in consumer:
    print(message.value.decode())
