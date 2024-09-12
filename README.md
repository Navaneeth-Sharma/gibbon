# gibbon


Add the script to any website
```html
<script type="text/javascript" src="https://cdn.statically.io/gh/Navaneeth-Sharma/gibbon/main/gibbon-core-ec/build/gibbon.js"></script>
```

### Run Server locally 

1. Clone the project 
    ```bash
    git clone https://github.com/Navaneeth-Sharma/gibbon.git
    ```
2. Install clickhouse via docker and run the clickhouse server.
    ```bash
    docker pull clickhouse/clickhouse-server
    docker run -d --name clickhouse-server -p 8123:8123 -p 9000:9000 clickhouse/clickhouse-server
    ```
3. Install packages
    ```bash
    pip install -r requirements.txt
    ```
4. Create database and tables 
    ```bash 
    python db.py
    ```
5. Run the fast api server
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 7543
    ```

