

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import time


# import custom libraries
import sys
sys.path.append("C:\\DATA\\Tasks\\lib\\hk")
import hk_psql

# import dash libraries
import plotly.express as px  # (version 4.7.0 or higher)
import plotly.graph_objects as go
from plotly.subplots import make_subplots

from dash import Dash,dash_table, dcc, html, Input, Output, State, MATCH, ALL  # pip install dash (version 2.0.0 or higher)
import dash_bootstrap_components as dbc
from dash.exceptions import PreventUpdate

from app import app

import dash
import json

ADD_DATA = "C:\\DATA\\data\\raw\\mimic4\\lookup\\"
dbs = ['sepsisR',]


schemas = {
    'mimic_core':['transfers', 'admissions','patients'],
    'mimic_hosp':['labevents',
    'diagnoses_icd','procedures_icd','drgcodes',
    'emar',],
    'mimic_icu':['chartevents', 'inputevents', 'procedureevents', 'icustays'],
}
print('start deleting')
for newdb in dbs:
    for schema,tables in schemas.items():
            q=f"""
            DROP SCHEMA IF EXISTS {newdb}_{schema} CASCADE;
            """

            # print(q) 
            hk_psql.cmd(q,'mimic')


