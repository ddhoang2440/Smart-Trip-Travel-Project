import requests
from datetime import datetime, UTC


# TODO: Paste your API key here
'''✔ Xác nhận bạn là ai
(OpenWeather biết người đang gọi là tài khoản của bạn)
✔ Kiểm soát số request bạn được phép gửi
(Mỗi API Key được phép 1000 request / ngày / phút tùy gói)
✔ Ngăn người lạ dùng API miễn phí
(người khác không thể xài data miễn phí từ OpenWeatherMap)
➡️ Nếu thiếu API Key → yêu cầu sẽ bị từ chối: “401 Unauthorized”'''
API_KEY = "9c0762af5ad0784e171265361cbae990" # Chìa khóa để chứng minh bạn có quyền truy cập

# You must not let your API key be shared on the internet under any circumstances.
# If you plan to send this notebook to another person or upload it to a platform like GitHub,
# remember to remove your API_KEY before you do so.
def get_current_city_lat_lon(city_name: str, api_key: str) -> tuple:
  """This function get the latitude and longtitude of `city_name`

  In professional applications, you should never hardcode (keep fixed) the API URL directly in your code.
  Instead, you should always define the API URL as a configuration or setting variable.
  """
  url = "http://api.openweathermap.org/geo/1.0/direct"

  params = {
    "q": city_name,
    "limit": 1,               # Change this for more results
    "appid": api_key
  }

  response = requests.get(url, params=params)
  response.raise_for_status()
  data = response.json()      # Remember to parse to JSON!

  if len(data) == 0:
    raise Exception("No city found")

  else:
    # Return the coordinate of the first result.
    return data[0]["lat"], data[0]["lon"]

def get_current_city_weather(city_name: str, api_key: str) -> dict:
  """This function get the current weather of `city_name`.

  In professional applications, you should never hardcode (keep fixed) the API URL directly in your code.
  Instead, you should always define the API URL as a configuration or setting variable.
  """
  url = "https://api.openweathermap.org/data/2.5/weather"

  # Since the API required latitude and longtitude of the city,
  city_lat, city_lon = get_current_city_lat_lon(
      city_name=city_name,
      api_key=api_key
  )

  params = {
    "lat": city_lat,
    "lon": city_lon,
    "APPID": api_key,
    "units": "metric",   # or "imperial", "standard"
  }

  response = requests.get(url, params=params)
  response.raise_for_status()
  data = response.json()

  return data


# Get current weather of HCMC
city_name="Ho Chi Minh City, Vietnam"

HCMC_data = get_current_city_weather(city_name=city_name, api_key=API_KEY)

# Print the data to see what's inside.
# print(HCMC_data)

# Print out current weather information fields i.e. temperature, description, humidity and wind speed.
temperature = HCMC_data["main"]["temp"]
humidity = HCMC_data["main"]["humidity"]
wind_speed = HCMC_data["wind"]["speed"]
description = HCMC_data["weather"][0]["description"]

print(f"Current weather in {city_name}:")
print(f"- Temperature: {temperature} °C")
print(f"- Humidity: {humidity}%")
print(f"- Wind speed: {wind_speed} m/s")


'''OpenWeatherMap cung cấp dự báo thời tiết liên tục trong 5 ngày sắp tới,
và mỗi 3 giờ họ cho bạn 1 bản ghi (1 forecast).'''

def get_3_hours_city_weather(city_name: str, api_key: str, cnt: int) -> dict:
  """This function get the weather forecast for the 5 days with data every 3 hours

  In professional applications, you should never hardcode (keep fixed) the API URL directly in your code.
  Instead, you should always define the API URL as a configuration or setting variable.
  """
  ''' Nơi bạn gửi yêu cầu (endpoint), Là địa chỉ của máy chủ OpenWeatherMap.
  → Bạn phải biết đúng URL để gửi request GET.
    Nếu không có URL → Python không biết gọi lên đâu → Không có dữ liệu trả về.
  '''
  url = "https://api.openweathermap.org/data/2.5/forecast"

  # Since the API required latitude and longtitude of the city,
  city_lat, city_lon = get_current_city_lat_lon(
      city_name=city_name,
      api_key=api_key
  )

  params = {
    "lat": city_lat,
    "lon": city_lon,
    "cnt": cnt,
    "appid": api_key,
    "units": "metric",   # or "imperial", "standard"
  }

  response = requests.get(url, params=params)
  response.raise_for_status()

  data = response.json()

  return data

HCMC_data = get_3_hours_city_weather(
    city_name=city_name,
    api_key=API_KEY,
    cnt=8) # cnt bang 8 o day la 8 forecast nghia la trong 1 ngay, khong phai 5 ngay

for timestamp in HCMC_data["list"]:
  date = datetime.fromtimestamp(timestamp["dt"], UTC)
  temperature = timestamp["main"]["temp"]
  humidity = timestamp["main"]["humidity"]
  description = timestamp["weather"][0]["description"]
  wind_speed = timestamp["wind"]["speed"]

  print(f"Weather in {city_name} at {date}:")
  print(f"- Temperature: {temperature} °C")
  print(f"- Humidity: {humidity}%")
  print(f"- Wind speed: {wind_speed} m/s")
  print(f"- Description: {description}")