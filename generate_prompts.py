
# Terrain English translations
terrains = [
    "Marshland with puddles and reeds", # Charco
    "Rolling Green Hills", # Colinas
    "Dense Green Forest", # Floresta
    "Dark and Gloomy Forest with twisted trees", # Floresta Sombria
    "A wide River flowing through landscape", # Lago ou Rio
    "Rocky Mountains", # Montanhas
    "High Towering Mountains", # Montanhas Altas
    "Murky Swamp with humid atmosphere", # Pantano
    "Open Grassy Plains", # Planície
    "Ancient Stone Ruins" # Ruínas
]

# Weather descriptions based on hexagonDataWarm
weather_map_warm = {
    1: "a hot sunny day with bright sunlight and clear blue sky",
    2: "a hot sunny day with bright sunlight and clear blue sky",
    3: "a violent storm with dark heavy clouds, thunder, heavy rain and strong gale winds",
    4: "a clear blue sky with bright sunlight and still air",
    5: "a clear blue sky with bright sunlight and windy conditions",
    6: "a light drizzle with grey skies and windy conditions",
    7: "heavy grey clouds blocking the sun and windy conditions",
    8: "heavy rain pouring down with dark skies and strong gale winds",
    9: "a clear blue sky with bright sunlight and a gentle breeze",
    10: "white fluffy clouds in a blue sky and windy conditions",
    11: "light drizzle with scattered clouds and a gentle breeze",
    12: "gentle rain with cloudy skies and windy conditions",
    13: "heavy rain with grey skies and windy conditions",
    14: "light drizzle with grey skies and windy conditions",
    15: "white fluffy clouds in a blue sky and a gentle breeze",
    16: "a foggy nebulous atmosphere with low visibility and a gentle breeze",
    17: "an overcast sky with uniform grey clouds and a gentle breeze",
    18: "gentle rain with cloudy skies and windy conditions",
    19: "a foggy nebulous atmosphere with low visibility and still air"
}

# Weather descriptions based on hexagonDataIntermediate
weather_map_intermediate = {
    1: "a freezing cold day with sharp sunlight and clear pale blue sky",
    2: "a freezing cold day with sharp sunlight and clear pale blue sky",
    3: "snow falling with grey skies and strong gale winds",
    4: "a clear pale blue sky with bright sunlight and still air",
    5: "a foggy nebulous atmosphere with low visibility and windy conditions",
    6: "heavy grey clouds blocking the sun and windy conditions",
    7: "snow flurries with gusty winds and grey skies",
    8: "snow flurries with strong gale winds and grey skies",
    9: "a foggy nebulous atmosphere with low visibility and a gentle breeze",
    10: "an overcast sky with uniform grey clouds and windy conditions",
    11: "a foggy nebulous atmosphere with low visibility and a gentle breeze",
    12: "gentle rain with cloudy skies and windy conditions",
    13: "heavy rain with grey skies and windy conditions",
    14: "light drizzle with grey skies and windy conditions",
    15: "light drizzle with scattered clouds and a gentle breeze",
    16: "white fluffy clouds in a blue sky and a gentle breeze",
    17: "an overcast sky with uniform grey clouds and a gentle breeze",
    18: "gentle rain with cloudy skies and windy conditions",
    19: "a foggy nebulous atmosphere with low visibility and still air"
}

# Weather descriptions based on hexagonDataWinter
weather_map_winter = {
    1: "a freezing cold day with sharp sunlight and clear pale blue sky",
    2: "a freezing cold day with sharp sunlight and clear pale blue sky",
    3: "a blinding blizzard with heavy snow and strong gale winds",
    4: "a clear pale blue sky with bright sunlight and still air",
    5: "a clear pale blue sky with bright sunlight and windy conditions",
    6: "heavy grey clouds blocking the sun and windy conditions",
    7: "an overcast sky with uniform grey clouds and windy conditions",
    8: "snow falling gently with grey skies and windy conditions",
    9: "a clear pale blue sky with bright sunlight and a gentle breeze",
    10: "white fluffy clouds in a blue sky and windy conditions",
    11: "a foggy nebulous atmosphere with low visibility and a gentle breeze",
    12: "snow flurries with gusty winds and grey skies (gentle breeze)",
    13: "snow flurries with strong gale winds and grey skies",
    14: "snow flurries with gusty winds and grey skies",
    15: "white fluffy clouds in a blue sky and a gentle breeze",
    16: "a foggy nebulous atmosphere with low visibility and a gentle breeze",
    17: "an overcast sky with uniform grey clouds and windy conditions",
    18: "snow flurries with gusty winds and grey skies",
    19: "a foggy nebulous atmosphere with low visibility and still air"
}

prompts = []
counter = 1

# Process Warm
for hex_id in range(1, 20):
    weather_desc = weather_map_warm[hex_id]
    for terrain in terrains:
        num_str = f"{counter:03d}"
        prompt = f"{num_str}. Create a landscape view illustration of {weather_desc} in {terrain}, at noon. dungeons and dragons artwork, realistic style."
        prompts.append(prompt)
        counter += 1

# Process Intermediate
for hex_id in range(1, 20):
    weather_desc = weather_map_intermediate[hex_id]
    for terrain in terrains:
        num_str = f"{counter:03d}"
        prompt = f"{num_str}. Create a landscape view illustration of {weather_desc} in {terrain}, at noon. dungeons and dragons artwork, realistic style."
        prompts.append(prompt)
        counter += 1

# Process Winter
for hex_id in range(1, 20):
    weather_desc = weather_map_winter[hex_id]
    for terrain in terrains:
        num_str = f"{counter:03d}"
        prompt = f"{num_str}. Create a landscape view illustration of {weather_desc} in {terrain}, at noon. dungeons and dragons artwork, realistic style."
        prompts.append(prompt)
        counter += 1

with open('prompts.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(prompts))
