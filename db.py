import clickhouse_connect

# Create a connection to the ClickHouse server
client = clickhouse_connect.get_client(host="localhost", port=8123)


# Set allow_experimental_json_type = 1
client.query("SET allow_experimental_json_type = 1;")

# Create a new database (optional)
client.query("CREATE DATABASE IF NOT EXISTS gibbon_core")

# # Select the database
client.query("USE gibbon_core")
# client.query("SET allow_experimental_json_type = 1;")

# # client.query("DROP DATABASE gibbon_core ")

# # Create a new table with JSON data type
client.query(
    """
    CREATE TABLE IF NOT EXISTS events (
        uuid UUID,
        session_id String,
        timestamp DateTime,
        user_id String,
        country String,
        browser String,
        device String,
        event JSON
    ) ENGINE = MergeTree()
    ORDER BY uuid
"""
)


# Insert data into the table
# client.query(
#     """
#     INSERT INTO events (uuid, session_id, timestamp, user_id, country, browser, device) VALUES
#     (generateUUIDv4(), '123', now(), 'nav', 'IN', 'chrome', 'android'),
#     (generateUUIDv4(), '321', now(), 'van', 'IN', 'chrome', 'm-ios'),
#     (generateUUIDv4(), '432', now(), 'shan', 'IN', 'chrome', 'android')
# """
# )

# Query data from the table
# result_df = client.query_df(
#     """SELECT
#     uuid,
#     session_id,
#     timestamp,
#     user_id,
#     country,
#     browser,
#     device,
#     CAST(event AS String) AS event_str
# FROM events
# LIMIT 10
# """
# )

# # Print the DataFrame
# print(result_df.event_str[2])
