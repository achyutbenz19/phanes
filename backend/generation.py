import google.generativeai as genai
import ast
import os
import json
import random
import re
from browser import BrowserAutomation
from config import *
from dotenv import load_dotenv

load_dotenv()

def get_key():
    api_keys = os.getenv("GOOGLE_GENERATIVE_AI_API_KEYS")
    api_keys_list = api_keys.split(", ")
    return random.choice(api_keys_list).strip()

def generate_content(prompt, image=None):
    global messages
    
    api_key = get_key()

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        "gemini-1.5-pro-latest",
        generation_config=genai.GenerationConfig(
            max_output_tokens=8000,
            temperature=0,
        ),
    )

    if image is None:
        response = model.generate_content(
            prompt, request_options={"timeout": 1000}
        )
    else:
        response = model.generate_content(
            [prompt, image], request_options={"timeout": 1000}
        )
    return response.text


def interpret(prompt, url, html_string, img):
    global messages
    
    user_prompt = f"""
        Current Page: 
        {html_string}

        Current Url:
        {url}

        Current_screenshot is attached

        Output a plan, then either output selectors, or a navigate object.
        If current page is the requested page, output selectors list.
        user: {prompt}
    """
    
    response = generate_content(
        system_prompt_interpret + "\n\n" + user_prompt, img
    )
    
    if "```json" in response:
        response = response.split("```json")[1].split("```")[0]
    obj = json.loads(response)
    return obj


def navigate_check(prompt, url):
    global messages
    api_key = get_key()

    user_prompt = f"""
        {navigate_prompt}

        Current Url:
        {url}

        User Prompt:
        {prompt}
    """
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        "gemini-1.5-pro-latest",
        generation_config=genai.GenerationConfig(
            max_output_tokens=4000,
            temperature=0,
        ),
    )

    response = model.generate_content(
        user_prompt, request_options={"timeout": 1000}
    )
    response = response.text
    if "```json" in response:
        response = response.split("```json")[1].split("```")[0]
    obj = json.loads(response)
    return obj


def generate(html, selectors, url):
    browser = BrowserAutomation()
    dom_elements = ""

    for element in selectors:
        if element["type"] == "xpath":
            extracted_elements = browser.extract_elements_by_xpath(html, element["selector"])
            dom_elements += "\n".join(map(str, extracted_elements)) + "\n"
        else:
            dom_elements += f"src: {element['selector']}\n"

    generated_ui = generate_content(
        dom_elements
        + "\n\n"
        + system_prompt_generate
        + "\n\n"
        + design_schema
        + "\n\n"
        + f"Only output div, button, input, and select elements.",
    )
    generated_ui = generated_ui.replace("```html", "").replace("```", "")
    fixed_generated_ui = fix_special_id(generated_ui)
    fixed_generated_ui = clear_href_attributes(fixed_generated_ui)
    return fixed_generated_ui


def fix_special_id(html_string):
    def replace_first_and_last(input_string, char_to_replace, replacement_char):
        first_index = input_string.find(char_to_replace)
        last_index = input_string.rfind(char_to_replace)

        if first_index != -1 and last_index != -1:
            if len(input_string) > 0:
                input_string = replacement_char + input_string[1:-1] + replacement_char
            return input_string
        else:
            return input_string

    def validate(input_str):
        if input_str.count('"') == 4:
            return replace_first_and_last(input_str, '"', "'")
        elif input_str.count("'") == 4:
            return replace_first_and_last(input_str, "'", '"')
        else:
            return input_str

    after_equals_all = html_string.split("special-id=")[
        1:
    ] 
    for id in after_equals_all:
        space_after = None
        space_after = id.split(" ")[0]
        space_after = id.split(">")[
            0
        ]
        if " " in space_after:
            space_after = id.split(" ")[0]
        html_string = html_string.replace(space_after, validate(space_after))
    return html_string


def clear_href_attributes(html_content):
    href_pattern = re.compile(
        r'\s*href\s*=\s*(".*?"|\'.*?\'|[^\'">\s]+)', re.IGNORECASE
    )
    return href_pattern.sub("", html_content)