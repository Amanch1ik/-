import locust
from locust import HttpUser, task, between

class YessLoyaltyUser(HttpUser):
    wait_time = between(1, 5)  # Случайная задержка между запросами
    
    @task(3)  # Больший вес для этого метода
    def view_bonuses(self):
        self.client.get("/api/v1/bonuses", 
            headers={"Authorization": "Bearer test_token"}
        )
    
    @task(2)
    def list_partners(self):
        self.client.get("/api/v1/partners")
    
    @task(1)
    def create_transaction(self):
        self.client.post("/api/v1/transactions", 
            json={
                "amount": 100,
                "partner_id": 1
            },
            headers={"Authorization": "Bearer test_token"}
        )

class HeavyLoadUser(HttpUser):
    wait_time = between(0.1, 1)  # Очень частые запросы
    
    @task
    def stress_test_endpoint(self):
        self.client.get("/api/v1/health")

# Конфигурация для запуска
def run_load_test():
    locust.main([
        "-f", "load_testing.py",
        "--host", "https://yess-loyalty.com",
        "-u", "1000",  # 1000 параллельных пользователей
        "-r", "100",   # Скорость роста 100 пользователей в секунду
        "--run-time", "1h"  # Время теста 1 час
    ])

if __name__ == "__main__":
    run_load_test()
