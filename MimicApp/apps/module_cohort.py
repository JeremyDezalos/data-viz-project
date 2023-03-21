# Import libraries
# from curses.panel import new_panel
# from selectors import EpollSelector
# from sre_parse import State
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
# from lib import connect_psql
# import psycopg2
# from sqlalchemy import create_engine
import time
# import custom libraries
import sys
sys.path.append("C:\\DATA\\Tasks\\lib\\hk")
import hk_psql


import plotly.express as px  # (version 4.7.0 or higher)
from dash import Dash,dash_table, dcc, html, Input, Output, State, MATCH, ALL  # pip install dash (version 2.0.0 or higher)
import dash_bootstrap_components as dbc
from dash.exceptions import PreventUpdate
from app import app

import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

import dash
import json

ADD_DATA = "C:\\DATA\\data\\raw\\mimic4\\lookup\\"
d_labitems = pd.read_csv(ADD_DATA+'d_labitems.csv')
d_icd_diagnoses = pd.read_csv(ADD_DATA+'d_icd_diagnoses.csv')
d_icd_procedures = pd.read_csv(ADD_DATA+'d_icd_procedures.csv')
d_items = pd.read_csv(ADD_DATA+'d_items.csv')
icustays = pd.read_csv(ADD_DATA+'icustays.csv')
digi_bio = pd.read_csv(ADD_DATA+'digi_bio.csv')


adm_types = pd.read_csv(ADD_DATA+'adm_types.csv')
adm_locs = pd.read_csv(ADD_DATA+'adm_locs.csv')
dis_locs = pd.read_csv(ADD_DATA+'dis_loc.csv')

print(dis_locs)

conn= None
conn = hk_psql.connect_psql('mimic')

df1_le = []
df1_transfers = []

dict_hadm=[]
flag=0
# app = Dash(external_stylesheets=[dbc.themes.BOOTSTRAP])

df_hadm=pd.DataFrame()
# app = Dash(__name__)

# -- Import and clean data (importing csv into pandas)
# df = pd.read_csv("intro_bees.csv")
# df = pd.read_csv("intro_bees.csv")

# df = df.groupby(['State', 'ANSI', 'Affected by', 'Year', 'state_code'])[['Pct of Colonies Impacted']].mean()
# df.reset_index(inplace=True)
# print(df[:5])

# connect to psql

# conn = connect_psql()


# ------------------------------------------------------------------------------
# App layout

table_transfers = dash_table.DataTable(
                        id='table-transfers',
                        columns=[{"name": 'd', "id": 'dfds', "deletable": True, "selectable": True}
                            # {"name": i, "id": i, "deletable": True, "selectable": True} for i in df.columns
                        ],
                        data=[],
                        editable=True,
                        filter_action="native",
                        sort_action="native",
                        sort_mode="multi",
                        column_selectable="single",
                        row_selectable="multi",
                        row_deletable=True,
                        selected_columns=[],
                        selected_rows=[],
                        page_action="native",
                        page_current= 0,
                        page_size= 10,
                        style_table={'width': '100%', 'overflowY': 'auto'},
                    ),
  

table_labevents=dbc.Row([
    dash_table.DataTable(
                id='table-labevents',
                columns=[{"name": 'd', "id": 'dfds', "deletable": True, "selectable": True}
                    # {"name": i, "id": i, "deletable": True, "selectable": True} for i in df.columns
                ],
                data=[],
                editable=False,
                filter_action="native",
                sort_action="native",
                sort_mode="multi",
                column_selectable="single",
                row_selectable="multi",
                row_deletable=False,
                selected_columns=[],
                selected_rows=[],
                page_action="native",
                page_current= 0,
                page_size= 15,
                style_table={'width': '100%', 'overflowY': 'auto'},
            ),
        
])
table_chartevents=dbc.Row([
    dash_table.DataTable(
                id='table-chartevents',
                columns=[{"name": 'd', "id": 'dfds', "deletable": True, "selectable": True}
                    # {"name": i, "id": i, "deletable": True, "selectable": True} for i in df.columns
                ],
                data=[],
                editable=True,
                filter_action="native",
                sort_action="native",
                sort_mode="multi",
                column_selectable="single",
                row_selectable="multi",
                row_deletable=True,
                selected_columns=[],
                selected_rows=[],
                page_action="native",
                page_current= 0,
                page_size= 15,
                style_table={'width': '100%', 'overflowY': 'auto'},
            ),
        
])

table_inputvents=dbc.Row([
    dash_table.DataTable(
                id='table-inputevents',
                columns=[{"name": 'd', "id": 'dfds', "deletable": True, "selectable": True}
                    # {"name": i, "id": i, "deletable": True, "selectable": True} for i in df.columns
                ],
                data=[],
                editable=True,
                filter_action="native",
                sort_action="native",
                sort_mode="multi",
                column_selectable="single",
                row_selectable="multi",
                row_deletable=True,
                selected_columns=[],
                selected_rows=[],
                page_action="native",
                page_current= 0,
                page_size= 15,
                style_table={'width': '100%', 'overflowY': 'auto'},
            ),
        
])
table_procedureevents=dbc.Row([
    dash_table.DataTable(
                id='table-procedureevents',
                columns=[{"name": 'd', "id": 'dfds', "deletable": True, "selectable": True}
                    # {"name": i, "id": i, "deletable": True, "selectable": True} for i in df.columns
                ],
                data=[],
                editable=True,
                filter_action="native",
                sort_action="native",
                sort_mode="multi",
                column_selectable="single",
                row_selectable="multi",
                row_deletable=True,
                selected_columns=[],
                selected_rows=[],
                page_action="native",
                page_current= 0,
                page_size= 15,
                style_table={'width': '100%', 'overflowY': 'auto'},
            ),
        
])


table_drgcodes=dbc.Row([
    dash_table.DataTable(
                id='table-drgcodes',
                columns=[{"name": 'd', "id": 'dfds', "deletable": True, "selectable": True}
                    # {"name": i, "id": i, "deletable": True, "selectable": True} for i in df.columns
                ],
                data=[],
                editable=True,
                filter_action="native",
                sort_action="native",
                sort_mode="multi",
                column_selectable="single",
                row_selectable="multi",
                row_deletable=True,
                selected_columns=[],
                selected_rows=[],
                page_action="native",
                page_current= 0,
                page_size= 15,
                style_table={'width': '100%', 'overflowY': 'auto'},
            ),
        
])

table_diagnoses_icd=dbc.Row([
    dash_table.DataTable(
                id='table-diagnoses_icd',
                columns=[{"name": 'd', "id": 'dfds', "deletable": True, "selectable": True}
                    # {"name": i, "id": i, "deletable": True, "selectable": True} for i in df.columns
                ],
                data=[],
                editable=True,
                filter_action="native",
                sort_action="native",
                sort_mode="multi",
                column_selectable="single",
                row_selectable="multi",
                row_deletable=True,
                selected_columns=[],
                selected_rows=[],
                page_action="native",
                page_current= 0,
                page_size= 15,
                style_table={'width': '100%', 'overflowY': 'auto'},
            ),
        
])

table_procedures_icd=dbc.Row([
    dash_table.DataTable(
                id='table-procedures_icd',
                columns=[{"name": 'd', "id": 'dfds', "deletable": True, "selectable": True}
                    # {"name": i, "id": i, "deletable": True, "selectable": True} for i in df.columns
                ],
                data=[],
                editable=True,
                filter_action="native",
                sort_action="native",
                sort_mode="multi",
                column_selectable="single",
                row_selectable="multi",
                row_deletable=True,
                selected_columns=[],
                selected_rows=[],
                page_action="native",
                page_current= 0,
                page_size= 15,
                style_table={'width': '100%', 'overflowY': 'auto'},
            ),
        
])

tab_overview_demo = dbc.Row([

    dbc.Col([
        html.H5("Select the cohort", className="card-text", style={}),
        dcc.Dropdown(['sepsis2','b', 'digi'],
                        [],
                        multi=False,
        id='dd-cohort',style={'width': '100%'}),
        html.Br(),
        dbc.Button("Load", color="primary", id='button-load-cohort'),
        html.Br(),
        html.Li("No cohort has been loaded", className="card-text", style={}, id='li-cohort-result'),
    

    ], width=3),
    
    dbc.Col([
        dcc.Graph(figure={}, id='graph-age-hist')
    ], width=3),
    dbc.Col([
        dcc.Graph(figure={}, id='graph-age-box')
    ], width=3),
    dbc.Col([
        dcc.Graph(figure={}, id='graph-gender')


    ], width=3),
    # dbc.Col([
    #     dcc.Graph(figure={}, id='graph-transfers-los-box')


    # ], width=8),

    dbc.Col([
        dcc.Graph(figure={}, id='graph-box-los-per-hadm')
    ], width=2),

    dbc.Col([
        dcc.Graph(figure={}, id='graph-transfers-sum-los-pie')


    ], width=5),

    dbc.Col([
        dcc.Graph(figure={}, id='graph-transfers-count-pie')


    ], width=5),

    


    dbc.Col([
        dcc.Graph(figure={}, id='graph-box-los-per-careunit')
    ], width=12),



    dbc.Col([
        dash_table.DataTable(
            data=[], columns=[],
            page_size=10,sort_action="native", sort_mode="multi",
            style_table={'width': '35%', 'overflowY': 'auto'},
            editable=True,
            id='table-overview',
        )

    ], width=6),

    # dbc.Col([
    #     dash_table.DataTable(
    #         id='table-transfers-summary',
    #         columns=[{"name": 'd', "id": 'dfds', "deletable": True, "selectable": True}
    #             # {"name": i, "id": i, "deletable": True, "selectable": True} for i in df.columns
    #         ],
    #         data=[],
    #         editable=True,
    #         filter_action="native",
    #         sort_action="native",
    #         sort_mode="multi",
    #         column_selectable="single",
    #         row_selectable="multi",
    #         row_deletable=True,
    #         selected_columns=[],
    #         selected_rows=[],
    #         page_action="native",
    #         page_current= 0,
    #         page_size= 10,
    #         style_table={'width': '100%', 'overflowY': 'auto'},
    #     ),

    # ], width=2),
        
    
    # dbc.Col([
    #     dash_table.DataTable(
    #         data=[], columns=[],
    #         page_size=10,sort_action="native", sort_mode="multi",
    #         style_table={'width': '35%', 'overflowY': 'auto'},
    #         editable=True,
    #         id='table-overview',
    #     )

    # ], width=4),
   


])

tab_overview_bio = dbc.Row([
        
        dbc.Row([
            dbc.Col([
                html.H5("Boxplot settings", className="card-text", style={}),
                
                html.Br(),
                html.H6("x", className="card-text", style={}),
                dcc.Dropdown(['label','careunit'],
                    [],
                    multi=False,
                    id='dd-bio-x',style={'width': '100%'}),
                
                html.Br(),
                html.H6("y axis", className="card-text", style={}),
                dcc.Dropdown(['diff_50%','counts', 'total counts'],
                    [],
                    multi=False,
                    id='dd-bio-y',style={'width': '100%'}),
                
                html.Br(),
                html.H6("color", className="card-text", style={}),
                dcc.Dropdown(['label','careunit'],
                    [],
                    multi=False,
                    id='dd-bio-color',style={'width': '100%'}),

                

            ], width=2),
            dbc.Col([

                html.Br(),
                html.H6("minimum points in a careunit", className="card-text", style={}),
                dcc.Slider(1, 15, 1,
                    value=1,
                    id='slider-min-count'
                ),

                html.Br(),
                html.H6("care unit length of stay (hours)", className="card-text", style={}),
                dcc.RangeSlider(1, 240, value=[5, 48], id='slider-range-los',
                     allowCross=False, tooltip={"placement": "bottom", "always_visible": True}
                ),

                html.Br(),
                dbc.Button("Apply", color="primary", id='button-bio-summary'),
            ], width=4)


        ]),

        dbc.Row([
            dbc.Col([
                dcc.Graph(figure={}, id='graph-bio-box')


            ], width=12),
        ])
        
    ])





tab_overview = dbc.Tabs([
    dbc.Tab([  tab_overview_demo ], label='Demographics' ),
    dbc.Tab([  tab_overview_bio ], label='Biomarkers' ),
    
    ], className="mt-3",
)


tab_hospstay = dbc.Accordion([
    dbc.AccordionItem([
            html.H5("Select the hamd_id", className="card-text", style={}),
            dcc.Dropdown([22793142],
                            [22793142],
                            multi=False,
            id='dd-hamd_ids',style={'width': '200px', 'display': 'inline-block'}),
            dbc.Button("Update", color="primary", id='button-update-hadm'),
            
            
            
            dbc.Row([
                dbc.Row([

                ]),
                dbc.Row([   
                    dcc.Graph(figure={}, id='graph-transfers')
                ]),
            ]),
            
            

    ],title="Load Admission",),

    



    ],className="mt-3",)

tab_vis = dbc.Row([

    dbc.Row([
        dbc.Col([
            dbc.ButtonGroup([
                dbc.Button("Add panel", n_clicks=1, n_clicks_timestamp=0, color="primary", id='button-add-panel-S'),
                dbc.Button("Add panel 2", n_clicks=1, n_clicks_timestamp=0, color="primary", id='button-add-panel-L'),    
            ])
            
        ], width=2)
        

    ]),

    dbc.Row([
        dbc.Col([

            dbc.Tabs([
                dbc.Tab(table_transfers, label='Transfers'),
                dbc.Tab(table_labevents, label='Lab events'),
                dbc.Tab(table_chartevents, label='Chart events'),
                dbc.Tab(table_inputvents, label='Input events'),
                dbc.Tab(table_procedureevents, label='Procedure events'),
                dbc.Tab(table_drgcodes, label='drgcodes'),
                dbc.Tab(table_diagnoses_icd, label='diagnoses_icd'),
                dbc.Tab(table_procedures_icd, label='procedures_icd'),
                # dbc.Tab(tab_vis, label='Visualization'),
            ]),


        ], width=6)
            
    ]),

    dbc.Row([

    ],id='row-panels')



],className="mt-3",)



row_header = dbc.Row([
                dbc.Col([
                    html.Div([
                    html.H1("MIMIC IV App", style={'text-align': 'left'}),        
                    ],className='header-title'),

                    html.Div([
                        html.H2("Module > Cohort Visualizer", style={'text-align': 'left'}),
                    ],className='header-desc'),
                ],width=8),
                
                dbc.Col([
                    html.Div([
                        html.Img(src="/assets/epfl_logo.png", height='80px'),
                    ],className='logo-epfl',style={'width': '45%', 'display': 'inline-block', 'outline': 'thin lightgrey solid', 'padding': 10},),

                    html.Div([
                        html.Img(src="/assets/digi_logo.png", height='80px'),
                    ],className='logo-digi', style={'width': '45%', 'display': 'inline-block', 'outline': 'thin lightgrey solid', 'padding': 10},),

                    html.H5("Connection status:", style={'text-align': 'left'}),
                    dbc.Button("Not Connected", color="danger", className="me-1", id='button-connect'),


                ],width=4),


            ])

row_body = dbc.Row([
    dbc.Tabs([
        dbc.Tab(tab_overview, label='Overview'),
        dbc.Tab(tab_hospstay, label='Hospital Stay'),
        dbc.Tab(tab_vis, label='Visualization'),
    ]),


])

row_footer = dbc.Row([
                html.H2("Contact Me!"),
            ])








layout = dbc.Container([

    dcc.Store(id='df_filtered', data=[], storage_type='memory'), # 'local' or 'session'
    dcc.Store(id='dict_hadm', data=[], storage_type='memory'), # 'local' or 'session'
    dcc.Store(id='data-cohort', data=[], storage_type='memory'), # 'local' or 'session'
    dcc.Store(id='memory-hadm_ids', data=[], storage_type='memory'), # 'local' or 'session'

    row_header,

    row_body,

    row_footer,

    

    
    
    

], fluid=True)




# ------------------------------------------------------------------------------
# Connect the Plotly graphs with Dash Components
# connect to psql

#



# load hadm
@app.callback(

    Output('dict_hadm', 'data'),

    Output('table-labevents', 'data'),
    Output('table-labevents', 'columns'),
    Output('table-chartevents', 'data'),
    Output('table-chartevents', 'columns'),
    Output('table-inputevents', 'data'),
    Output('table-inputevents', 'columns'),
    Output('table-procedureevents', 'data'),
    Output('table-procedureevents', 'columns'),
    Output('table-drgcodes', 'data'),
    Output('table-drgcodes', 'columns'),
    Output('table-diagnoses_icd', 'data'),
    Output('table-diagnoses_icd', 'columns'),
    Output('table-procedures_icd', 'data'),
    Output('table-procedures_icd', 'columns'),

    Output('table-transfers', 'data'),
    Output('table-transfers', 'columns'),
    Output('table-transfers', 'selected_rows'),
    Output('graph-transfers', 'figure'),


    Input('button-update-hadm', 'n_clicks'),
    State('data-cohort', 'data'),
    State('dd-hamd_ids', 'value'),
    
    prevent_initial_call=True

    )

def load_hadm(n_clicks, cohort, hadm_id):
    print('hi 1')
    global dict_hadm
    dict_hadm = hk_psql.load_hadm(conn, cohort, hadm_id)
    adm_time = dict_hadm['mimic_core']['admissions']['admittime'].iloc[0]

    print('hi 223242')
    # print(dict_hadm['mimic_icu']['chartevents'])
    # print('hi 3')

    df_hosp_summary = hk_psql.hosp_summary(dict_hadm, d_labitems)

    print(df_hosp_summary)
    df=hk_psql.data2hour(dict_hadm['mimic_icu']['inputevents'], adm_time)
    df = hk_psql.summary_by(df, 'itemid')
    df_icu_summary = hk_psql.icu_summary(dict_hadm, d_items)

    print('hi 3')
    df_tra = dict_hadm['mimic_core']['transfers']
    df_tra_summary, fig_transfers  = hk_psql.tra_summary(df_tra)
    dict_tra_summary = df_tra_summary.to_dict('records')
    tbl_cols_tra = [{"name": i, "id": i, "deletable": True, "selectable": True} for i in df_tra_summary.columns]

    # print(df_hosp_summary)
    print(dict_hadm['mimic_hosp'])
    dict_labevents, cols_labevents = hk_psql.df_to_dashTable(df_hosp_summary)
    dict_chartevents, cols_chartevents = hk_psql.df_to_dashTable(df_icu_summary)
    dict_labevents, cols_labevents = hk_psql.df_to_dashTable(dict_hadm['mimic_hosp']['labevents'], adm_time)
    dict_chartevents, cols_chartevents = hk_psql.df_to_dashTable(dict_hadm['mimic_icu']['chartevents'], adm_time)
    dict_inputevents, cols_inputevents = hk_psql.df_to_dashTable(dict_hadm['mimic_icu']['inputevents'], adm_time)
    # print(cols_inputevents)
    # prfdsfa
    dict_procedureevents, cols_procedureevents = hk_psql.df_to_dashTable(dict_hadm['mimic_icu']['procedureevents'], adm_time)
    dict_drgcodes, cols_drgcodes = hk_psql.df_to_dashTable(dict_hadm['mimic_hosp']['drgcodes'])
    
    dict_diagnoses_icd, cols_diagnoses_icd = hk_psql.df_to_dashTable(dict_hadm['mimic_hosp']['diagnoses_icd'])
    # dict_diagnoses_icd, cols_diagnoses_icd = hk_psql.df_to_dashTable(dict_hadm['mimic_hosp']['drgcodes'])

    dict_procedures_icd, cols_procedures_icd = hk_psql.df_to_dashTable(dict_hadm['mimic_hosp']['procedures_icd'])
    # dict_procedures_icd, cols_procedures_icd = hk_psql.df_to_dashTable(dict_hadm['mimic_hosp']['drgcodes'])
   
    # print(dict_hosp_summary)
    # print(dict_hosp_summary.keys().tolist())

    tra_selected_rows = [i for i in range(len(dict_tra_summary))]

    

    return dash.no_update, \
        dict_labevents, cols_labevents, \
        dict_chartevents, cols_chartevents,\
        dict_inputevents, cols_inputevents,\
        dict_procedureevents, cols_procedureevents,\
        dict_drgcodes, cols_drgcodes, \
        dict_diagnoses_icd, cols_diagnoses_icd, \
        dict_procedures_icd, cols_procedures_icd, \
            dict_tra_summary, tbl_cols_tra, tra_selected_rows,\
             fig_transfers,\
             




# updating panel
@app.callback(

    Output(component_id={'type': 'dynamic-panel-graph', 'index': MATCH}, component_property='figure'),
    Output(component_id={'type': 'dynamic-dd-hosp-axisL', 'index': MATCH}, component_property='options'),
    Output(component_id={'type': 'dynamic-dd-hosp-axisR', 'index': MATCH}, component_property='options'),
    
    Input(component_id={'type': 'dynamic-dd-hosp-axisL', 'index': MATCH}, component_property='value'),
    Input(component_id={'type': 'dynamic-dd-hosp-axisR', 'index': MATCH}, component_property='value'),
    Input(component_id={'type': 'slider-panel-width', 'index': MATCH}, component_property='value'),
    Input(component_id={'type': 'slider-subplot1-height', 'index': MATCH}, component_property='value'),
    Input(component_id={'type': 'slider-subplot2-height', 'index': MATCH}, component_property='value'),
    Input(component_id={'type': 'dynamic-panel-graph', 'index': MATCH}, component_property='figure'),
    
    Input('table-labevents', "derived_virtual_data"),
    Input('table-labevents', "derived_virtual_selected_rows"),
    Input('table-chartevents', "derived_virtual_data"),
    Input('table-chartevents', "derived_virtual_selected_rows"),
    Input('table-inputevents', "derived_virtual_data"),
    Input('table-inputevents', "derived_virtual_selected_rows"),
    Input('table-procedureevents', "derived_virtual_data"),
    Input('table-procedureevents', "derived_virtual_selected_rows"),
    
    
    Input('table-transfers', "derived_virtual_data"),
    Input('table-transfers', "derived_virtual_selected_rows"),

    prevent_initial_call=True

    )

def update_panel(dd_axisL, dd_axisR, w, h1, h2,graph1,
     tbl_labevents_data, tbl_labevents_row,\
         tbl_chartevents_data, tbl_chartevents_row,\
             tbl_inputevents_data, tbl_inputevents_row,\
                 tbl_procedureevents_data, tbl_procedureevents_row,\
              tbl_transfers_data, tbl_transfers_row):
    # if len(sel_lab)==0:
    #     raise PreventUpdate
    print('ZZZZZZZZZZZZZZZZZZZ')

    print(dd_axisL)
    df_labevents_filterd = pd.DataFrame.from_dict(tbl_labevents_data)
    df_labevents_filterd = df_labevents_filterd.iloc[tbl_labevents_row]

    print(df_labevents_filterd.dtypes)

    df_chartevents_filterd = pd.DataFrame.from_dict(tbl_chartevents_data)
    df_chartevents_filterd = df_chartevents_filterd.iloc[tbl_chartevents_row]

    df_inputevents_filterd = pd.DataFrame.from_dict(tbl_inputevents_data)
    df_inputevents_filterd = df_inputevents_filterd.iloc[tbl_inputevents_row]
    df_inputevents_filterd = df_inputevents_filterd.rename(columns={"starttime": "x_start", "endtime": "x_end", "label": "y"})
    df_inputevents_filterd['color'] = df_inputevents_filterd['y']

    df_procedureevents_filterd = pd.DataFrame.from_dict(tbl_procedureevents_data)
    df_procedureevents_filterd = df_procedureevents_filterd.iloc[tbl_procedureevents_row]
    df_procedureevents_filterd = df_procedureevents_filterd.rename(columns={"starttime": "x_start", "endtime": "x_end", "label": "y"})
    df_procedureevents_filterd['color'] = df_procedureevents_filterd['y']
    
    

    df_concat = pd.concat([df_labevents_filterd, df_chartevents_filterd])
    dd_options = {row['itemid']: row['label'] for _,row in df_concat[['itemid', 'label']].iterrows()}
    print(dd_options)

    df_transfers_filterd = pd.DataFrame.from_dict(tbl_transfers_data)
    df_transfers_filterd = df_transfers_filterd.iloc[tbl_transfers_row]
    print(df_transfers_filterd)
    x_range = [df_transfers_filterd['intime'].min(), df_transfers_filterd['intime'].max()]
    print(x_range)
    dd_axisL = [int(i) for i in dd_axisL]
    dd_axisR = [int(i) for i in dd_axisR]

    print('update panel')
    # print(graph1)

    print(dd_axisL)
    print(dd_axisR)
    # print(dict_hadm['mimic_hosp'])
    

    

    adm_time = dict_hadm['mimic_core']['admissions']['admittime'].iloc[0]
    dis_time = dict_hadm['mimic_core']['admissions']['dischtime'].iloc[0]
    hosp_los = (dis_time - adm_time) / np.timedelta64(1,'h')
    

    

    data_left = {'x':[], 'y':[], 'label':[]}    
    data_left = hk_psql.read_from_itemid(dict_hadm, dd_axisL)


        
    data_right = {'x':[], 'y':[], 'label':[]}    
    data_right = hk_psql.read_from_itemid(dict_hadm, dd_axisR)


    df_tra = dict_hadm['mimic_core']['transfers']
    df_tra_summary, _  = hk_psql.tra_summary(df_tra)

    df_tra = df_tra.dropna(subset=['careunit'])
    df_tra = hk_psql.data2hour(df_tra, adm_time)

    df_tra = df_tra.rename(columns={"intime": "x_start", "outtime": "x_end", "careunit": "color"})
    df_tra['y'] = 'careunit'

    print(df_tra)
    print(df_inputevents_filterd)
    print(df_procedureevents_filterd)

    
    

    print('kaldddddddddddddddddddddddd')
    

    df_events = pd.DataFrame()
    df_events = pd.concat([df_tra, df_inputevents_filterd, df_procedureevents_filterd], axis=0, join="inner")
    print(df_events)
    # df_events['x_start']=df_tra_summary['intime']
    # df_events['x_end']=df_tra_summary['outtime']
    # df_events['y']= 'care unit'
    # df_events['color']=df_tra_summary['careunit']
    # print(df_events)
    fig = hk_psql.scatterplot(data_left, data_right, df_events, h1, h2)

    fig.update_layout(xaxis_range=[0,hosp_los])
    fig.update_layout(legend=dict(
        yanchor="top",
        y=1,
        xanchor="left",
        x=1
    
    ))

    fig.update_xaxes(
        # tickangle = 90,
        title_text = "Hospital stay (hours)",
        range = x_range
        # title_font = {"size": 20},
        # title_standoff = 25
        
        )
    fig.update_layout(width=int(w), height=int(h1+h2))
    # print('ENDDDDDDDDDDDDDDD')
    # print(fig)
    # print(fig.layout)


    return fig, dd_options, dd_options



# adding a new panel
@app.callback(

    Output('row-panels', 'children'),
    [
    Input('button-add-panel-S', 'n_clicks'),

    Input('button-add-panel-S', 'n_clicks_timestamp'),
    Input('button-add-panel-L', 'n_clicks_timestamp'),
    Input(component_id={'type': 'dynamic-close-panel', 'index': ALL}, component_property='n_clicks'),
    

    ],
    [State('row-panels', 'children'),

    ],
    
    prevent_initial_call=True

    )

def add_panel(n_clicks, n_clicks_ts_S,n_clicks_ts_L, _, card_gorup_ch):
    print('add panel')
    
    if int(n_clicks_ts_S) > int(n_clicks_ts_L):
        width_selected = 4
    else:
        width_selected=12
    
    

    input_id = dash.callback_context.triggered[0]["prop_id"].split(".")[0]
    # print(input_id)
    if "index" in input_id:
        delete_chart = json.loads(input_id)["index"]
        card_gorup_ch = [
            chart
            for chart in card_gorup_ch
            if "'index': " + str(delete_chart) not in str(chart)
        ]
    else:
        
        
        new_panel = dbc.Col([
        
        dbc.Card(
            dbc.CardBody([
                dbc.Row([
                    dbc.Col([
                        dbc.Button("X", color="danger", 
                        id={'type': 'dynamic-close-panel', 'index': n_clicks},),
                    ]),

                    dbc.Col([
                        html.H4(f"Panel {n_clicks}"),
                    ]),
                    

                ], justify="start", className="g-1"),
                
                
                # html.H6("Card subtitle", className="card-subtitle"),
                # html.P(
                #     "Some quick example text to build on the card title and make "
                #     "up the bulk of the card's content.",
                #     className="card-text",
                # ),

                html.H6("Left axis", className="card-subtitle"),
                dcc.Dropdown(
                    options = [],
                                value=[],
                                multi=True,
                    style={'width': '100%', 'display': 'inline-block'},
                    id={'type': 'dynamic-dd-hosp-axisL', 'index': n_clicks},
                ),

                html.H6("Right axis", className="card-subtitle"),
                dcc.Dropdown(options = [],
                                value=[],
                                multi=True,
                    style={'width': '100%', 'display': 'inline-block'},
                    id={'type': 'dynamic-dd-hosp-axisR', 'index': n_clicks},
                ),


                html.H6("Panel Width", className="card-subtitle"),
                dcc.Slider(1000, 2000, 250,
                        value=1500,
                        updatemode='drag',
                        id={
                            'type': 'slider-panel-width',
                            'index': n_clicks
                        },
                ),
                
                html.H6("H1", className="card-subtitle"),
                dcc.Slider(200, 800, 100,
                        value=400,
                        updatemode='drag',
                        id={
                            'type': 'slider-subplot1-height',
                            'index': n_clicks
                        },
                ),
                html.H6("H2", className="card-subtitle"),
                dcc.Slider(100, 800, 100,
                        value=200,
                        updatemode='drag',
                        id={
                            'type': 'slider-subplot2-height',
                            'index': n_clicks
                        },
                ),
                
                dcc.Graph(
                    id={
                        'type': 'dynamic-panel-graph',
                        'index': n_clicks
                    },
                    figure=make_subplots(
                        specs=[[{"secondary_y": True}], [{"secondary_y": False}]],
                        rows=2, cols=1,
                        shared_xaxes=True,
                        vertical_spacing=0.02,
                    ),
                    style={'height': '800px'},
                ),
            ]),
        # style={"width": "100%"},
        )
        ], width=width_selected, id={'type': 'dynamic-col-panel', 'index': n_clicks})
        # ], id={'type': 'dynamic-col-panel', 'index': n_clicks})
        card_gorup_ch.append(new_panel)
    

    return card_gorup_ch


    
#     return
# loading hadm_ids
@app.callback(

    Output('table-overview', 'data'),
    Output('table-overview', 'columns'),
    Output('li-cohort-result', 'children'),
    Output('dd-hamd_ids', 'options'),
    Output('data-cohort', 'data'),
    
    Output('graph-age-hist', 'figure'),
    Output('graph-age-box', 'figure'),
    Output('graph-gender', 'figure'),

    Output('graph-transfers-sum-los-pie', 'figure'),
    Output('graph-transfers-count-pie', 'figure'),

    Output('graph-box-los-per-hadm', 'figure'),
    Output('graph-box-los-per-careunit', 'figure'),


    Input('button-load-cohort', 'n_clicks'),
    State('dd-cohort', 'value'),
    

    prevent_initial_call=True

    )

def update_table_overview(n_clicks, sel_cohort):

    schema_core = sel_cohort+'_mimic_core'
    df_overview = hk_psql.summary(schema_core, conn)
    hadm_ids = df_overview['hadm_id'].unique()
    print(df_overview)
    result = f"{len(df_overview)} hospital admissions has been found!"
    # print(df_overview) 
    # print(df_overview.dtypes) 
    table_lab_data=df_overview.to_dict('records')
    table_lab_columns=[{'id': c, 'name': c} for c in df_overview.columns]
    q=f"""
    select * from mimic_core.patients t1
    inner join {schema_core}.admissions t2
    on t1.subject_id = t2.subject_id
    where t2.hadm_id in ({str(hadm_ids.tolist())[1:-1]})
    
    """
    print(q)

    df_patients = hk_psql.query(q, conn)
    print(df_patients)
    # print(df_patients_core'])
    # print(df_age)
    fig_age_hist = px.histogram(df_patients, x="anchor_age",labels={'anchor_age': 'Age'} ,title='Age histogram')
    fig_age_box = px.box(df_patients, y="anchor_age",labels={'anchor_age': 'Age'} , title='Age boxplot', points="all")
    df_temp=df_patients['gender'].value_counts().rename_axis('gender').reset_index(name='counts')
    print(df_temp)
    fig_gender = px.pie(df_temp, values='counts', names='gender', title='Gender')


    q=f"""
        select * from {schema_core}.transfers         
        """
    print(q)

    df_transfers = hk_psql.query(q, conn)
    print(df_transfers)


    q=f"""
        select * from {sel_cohort+'_mimic_core'}.admissions         
        """

    df_adm = hk_psql.query(q, conn)
    print(df_adm)
    print(df_adm[['hadm_id', 'admittime', 'dischtime']])
    df_adm['los'] = df_adm['dischtime'] - df_adm['admittime']
    df_adm['los'] = round((df_adm['los']) / np.timedelta64(1,'h'),2)
    print(df_adm)

    df_tra_summary, _ = hk_psql.tra_summary(df_transfers)
    df_temp = df_tra_summary.groupby('careunit')['stay (hours)'].sum().reset_index(name ='sum (hours)').sort_values('sum (hours)',ascending=False).iloc[:10]
    # fig_careunit = px.bar(df_temp, x='careunit', y='sum (hours)')
    # fig_careunit = px.pie(df_temp, values='sum (hours)', names='careunit', title='Care units')

    df_transfers = pd.merge(df_transfers, df_adm[['hadm_id', 'admittime', 'dischtime']] )
    df_transfers = df_transfers.dropna(subset=['careunit'])
    df_transfers = df_transfers.sort_values(['hadm_id', 'intime'])

    df_transfers['intime'] = df_transfers['intime'] - df_transfers['admittime']
    df_transfers['intime'] = round((df_transfers['intime']) / np.timedelta64(1,'h'),2)
    
    df_transfers['outtime'] = df_transfers['outtime'] - df_transfers['admittime']
    df_transfers['outtime'] = round((df_transfers['outtime']) / np.timedelta64(1,'h'),2)
    df_transfers['los'] = df_transfers['outtime'] - df_transfers['intime']
    df_transfers.to_csv(ADD_DATA+'tr.csv')


    df_temp = df_transfers.groupby('hadm_id')['los'].sum().reset_index(name ='LOS (hours)')
    graph_box_los_per_hadm = px.box(df_temp,  y="LOS (hours)", points="all", hover_data=["hadm_id"])

    
    
    # df_temp = df_transfers.groupby(['transfer_id','hadm_id'])['los'].sum().reset_index(name ='LOS (hours)')
    # sort boxplot by decesing median
    df_temp = df_transfers.groupby('careunit')['los'].median().reset_index(name='median')
    df_temp = pd.merge(df_transfers, df_temp).sort_values('median', ascending=False)
    graph_box_los_per_careunit = px.box(df_temp, x='careunit',  y="los", color='careunit', points="all", range_y=[0,75], hover_data=["hadm_id",'transfer_id'])
    graph_box_los_per_careunit.update_xaxes(tickangle=45)




    fig_transfers_los_box = px.box(df_transfers,x='careunit',  y="los", color='careunit', points="all")
    fig_transfers_los_box.update_xaxes(tickangle=45)

    df_temp1 = df_transfers.groupby('careunit')['los'].sum().reset_index(name ='sum (hours)').sort_values('sum (hours)',ascending=False).iloc[:10]
    df_temp2 = df_transfers.groupby('careunit').size().reset_index(name ='count').sort_values('count',ascending=False).iloc[:10]
    
    df_temp = pd.merge(df_temp1,df_temp2)
    df_temp.to_csv(ADD_DATA+'df_temp.csv')

    fig_transfers_sum_los_pie = px.pie(df_temp, values='sum (hours)', names='careunit', title='total LOS(hours)')
    fig_transfers_count_pie = px.pie(df_temp, values='count', names='careunit', title='# of stays')

    print(df_temp)


    
    # LAB EVENTS
    q=f"""
        select * from {sel_cohort+'_mimic_hosp'}.labevents         
        """
    print(q)

    df_le = hk_psql.query(q, conn)
    print('***********************************')
    itemids=[50813, 50889, 51003, 50963, 50924, 50909]
    df_le = df_le[df_le['itemid'].isin(itemids)]
    df_le['label'] = hk_psql.lookup_itemid(df_le['itemid'].tolist(), type=None)
    
    df_le = df_le.sort_values(['hadm_id', 'charttime'])

    # converting time to hours since admission
    df_le = pd.merge(df_le, df_adm[['hadm_id', 'admittime', 'dischtime']] )
    df_le['charttime'] = df_le['charttime'] - df_le['admittime']
    df_le['charttime'] = round((df_le['charttime']) / np.timedelta64(1,'h'),2)

    # saving difference between two consecutive measurements
    df_le['diff'] = df_le.groupby(['hadm_id','itemid'])['charttime'].diff()
    df_le = df_le.sort_values(['itemid','hadm_id','charttime'])
    df_le.to_csv(ADD_DATA+'dffff.csv')


    # assigning each measurement to a transfer_id
    df_le = hk_psql.cut(df_le, df_transfers)


    global df1_le

    df1_le = df_le



    global df1_transfers

    df1_transfers = df_transfers
    # df_le = hk_psql.data2hour(df_le)

    # df_le = df_le.sort_values(['label','hadm_id' ,'charttime'])
    # df_le.to_csv(ADD_DATA+'le.csv')

    # df_count = df_le.groupby(['label','hadm_id']).size().reset_index(name='counts').sort_values(['label','counts'], ascending=False)
    # df = pd.merge(df_le, df_count)
    # df.to_csv(ADD_DATA+'df.csv')

    # fig_boxplot = px.box(df, x="label", y="counts", color="careunit")



    



    # df_lac = df_le[df_le['itemid']==50813]
    # df_count_abnormal = df_lac.dropna(subset=['flag']).groupby('hadm_id')['flag'].size().reset_index(name='counts_abnormal')
    
    # print(df_count_abnormal)
    # df_lac['diff'] = df_lac.groupby('hadm_id')['charttime'].diff()
    # df_lac = df_lac.groupby('hadm_id')[['valuenum', 'diff']].describe().reset_index()
    # temp = ['_'.join(col) if col[1] !='' else ''.join(col) for col in df_lac.columns ]
    # temp[0] = 'hadm_id'
    # df_lac.columns = temp
    
    
    # df_lac = df_lac.sort_values('valuenum_count', ascending=False)
    # df_lac = pd.merge(df_lac, df_count_abnormal )
    # df_lac = pd.merge(df_lac, df_adm[['hadm_id', 'los']] )
    # df_lac['meas per hour stay'] = df_lac['los'] / df_lac['valuenum_count']
    # print(df_lac)














    # fig_gender = fig_age
    return table_lab_data, table_lab_columns, result, hadm_ids, sel_cohort,\
        fig_age_hist, fig_age_box, fig_gender,\
             fig_transfers_sum_los_pie,fig_transfers_count_pie,\
                 graph_box_los_per_hadm,graph_box_los_per_careunit
            

@app.callback(  

    Output('graph-bio-box', 'figure'),

    Input(component_id='button-bio-summary', component_property= 'n_clicks'),
    State(component_id='dd-bio-x', component_property= 'value'),
    State(component_id='dd-bio-y', component_property= 'value'),
    State(component_id='dd-bio-color', component_property= 'value'),
    State('slider-min-count', 'value'),
    State('slider-range-los', 'value'),

    prevent_initial_call=True

    ) 
def plot_bio_summary(n_clicks, x, y, color, min_count, los_range):


    global df1_le
    global df1_transfers

    # df1_le.to_csv(ADD_DATA+'df1_le.csv')
    # df1_transfers.to_csv(ADD_DATA+'df1_transfers.csv')


    print(x)
    print(y)
    print(color)

    df = df1_le.copy()

    g=['label', 'hadm_id', 'transfer_id']


    # print(g)
    temp = [x, color] if x!=color else [x]
    # print(temp)
    # print("DDDDDDDDDDDDD")
    
    
    # print(df_count_x)
    # print(df_count_color)
    # print(df_count_x_color)

    df_size = df.groupby(g).size().reset_index(name='counts')#.sort_values(['label','counts'], ascending=False)

    df_diff_describe = df.groupby(g)[['valuenum', 'diff']].describe().reset_index()
    df_diff_describe.columns = ['_'.join(col) if col[1] !='' else ''.join(col) for col in df_diff_describe.columns ]

    df = pd.merge(df_size, df_diff_describe)
    
    # print(df)
    # print(df1_transfers)
    df = pd.merge(df, df1_transfers[['transfer_id', 'careunit', 'los']])

    # if 'transfer_id' in g:
        
    #     df1 = df.groupby(['label', 'careunit']).size().reset_index(name='counts')#.sort_values(['label', 'counts'], ascending=False)
    #     df2 = df1.groupby(['label', 'counts']).head(5).reset_index(drop=True)
    #     df2 = df1.groupby(['label'])['counts'].nlargest(5).reset_index(drop=True)
    #     df2.to_csv(ADD_DATA+'df2.csv')
    
    print(df)
    df = df[df['counts']>=min_count]
    df = df[df['los'].between(los_range[0], los_range[1])]
    
    df_count_x = df.groupby(temp[0]).size().reset_index(name='count_x')#.sort_values(['count_x'], ascending=False)
    df_count_color = df.groupby(temp).size().reset_index(name='count_color')#.sort_values(['count_x'], ascending=False)
    df_count_x_color = pd.merge(df_count_color, df_count_x).sort_values(['count_x','count_color'], ascending=False)
    
    df = pd.merge(df, df_count_x_color).sort_values(['count_x','count_color'], ascending=False)
    # print(df)
    # df.to_csv(ADD_DATA+'df.csv')
    # print(df)
    








    if 'diff_50%' in y:
        y_label = 'hour'
        title = 'boxplot for median of measurement intervals in each hospital stay'
    else:
        y_label = 'counts'
        title = 'boxplot for number of measurements in each hospital stay'

    
   
    
    # print(df)
    if y=='total counts':
        
        df = df.drop_duplicates([*temp,'count_x'])
        # print(df)
        fig_bio_box = px.bar(df, x=x, y='count_color', color=color, title="Total counts")
    else:
        fig_bio_box = px.box(df, x=x, y=y, color=color, points="all",
            labels={    y: y_label,    },   title=title, hover_data=["hadm_id",'transfer_id','los']  )

    return fig_bio_box

@app.callback(  
    Output(component_id='button-connect', component_property='children'),
    Output(component_id='button-connect', component_property='color'),

    Input(component_id='button-connect', component_property= 'n_clicks'),


    prevent_initial_call=True

    ) 
def connect_to_psql(n_clicks):
    print(n_clicks)


    if n_clicks>0:
        global conn
        # print(n_clicks)
        # print(conn)
        conn = hk_psql.connect_psql('mimic')
    return 'Connected', 'success'














