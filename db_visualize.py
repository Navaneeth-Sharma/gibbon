import clickhouse_connect

# Create a connection to the ClickHouse server
client = clickhouse_connect.get_client(host="localhost", port=8123)

client.query("USE gibbon_core")

# Query data from the table
result_df = client.query_df(
    """SELECT
    uuid,
    session_id,
    timestamp,
    user_id,
    country,
    browser,
    device,
    CAST(event AS String) AS event_str
FROM events
LIMIT 10
"""
)

# Print the DataFrame
print(result_df.columns)
