# Import libraries

from logging import warning
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
ADD_DATA = "/mlodata1/hokarami/tedam/MimicApp/lookup/"
ADD_DATA="C:\\DATA\\data\\processed\\MimicApp\\lookup\\"
ADD_DATA="../resources/data1/lookup/"
DBNAME = 'datavis'


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
conn = hk_psql.connect_psql(DBNAME)


list_schema = hk_psql.get_schemas(DBNAME)
print(list_schema)


substring='_mimic'
strings_with_substring = [string[ : string.find(substring)] for string in list_schema if substring in string]

list_cohorts = list(set(strings_with_substring))

print(type(list_schema))
print(list_cohorts)


df1_le = []
df1_transfers = []

dict_hadm=[]
flag=0
# app = Dash(external_stylesheets=[dbc.themes.BOOTSTRAP])

df_hadm=pd.DataFrame()


kwargs_tables = {'style_as_list_view':True,
'style_cell':{'padding': '10px'},

'style_header':{     'backgroundColor': 'rgb(230, 230, 230)',
            'fontWeight': 'bold'
},

'style_data_conditional':[        # style_data.c refers only to data rows
    {
        'if': {'row_index': 'odd'},
        'backgroundColor': 'rgb(248, 248, 248)'
    }
],

'style_table':{ 'width':'100%'},
'page_size':10,


}

# import dash_core_components as dcc
# import dash_html_components as html
# from dash.dependencies import Input, Output
# import plotly.express as px
# import pandas as pd
import pathlib
# from app import app
print(app)
print("dddddddddd")
# get relative data folder
PATH = pathlib.Path(__file__).parent
DATA_PATH = PATH.joinpath("../datasets").resolve()

# dfv = pd.read_csv(DATA_PATH.joinpath("vgsales.csv"))  # GregorySmith Kaggle
sales_list = ["North American Sales", "EU Sales", "Japan Sales", "Other Sales",	"World Sales"]


# layout = html.Div([
#     html.H1('Video Games Sales', style={"textAlign": "center"}),

#     html.Div([
#         html.Div(dcc.Dropdown(
#             id='genre-dropdown', value='Strategy', clearable=False,
#             options=[{'label': x, 'value': x} for x in sorted(dfv.Genre.unique())]
#         ), className='six columns'),

#         html.Div(dcc.Dropdown(
#             id='sales-dropdown', value='EU Sales', clearable=False,
#             persistence=True, persistence_type='memory',
#             options=[{'label': x, 'value': x} for x in sales_list]
#         ), className='six columns'),
#     ], className='row'),

#     dcc.Graph(id='my-bar', figure={}),
# ])


# @app.callback(
#     Output(component_id='my-bar', component_property='figure'),
#     [Input(component_id='genre-dropdown', component_property='value'),
#      Input(component_id='sales-dropdown', component_property='value')]
# )
# def display_value(genre_chosen, sales_chosen):
#     dfv_fltrd = dfv[dfv['Genre'] == genre_chosen]
#     dfv_fltrd = dfv_fltrd.nlargest(10, sales_chosen)
#     fig = px.bar(dfv_fltrd, x='Video Game', y=sales_chosen, color='Platform')
#     fig = fig.update_yaxes(tickprefix="$", ticksuffix="M")
#     return fig



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
  
lab_cols = ['itemid', 'label', 'count', 'ref_range_lower','ref_range_upper']
chart_cols = ['itemid', 'label', 'count']


table_labevents=dbc.Row([
    dash_table.DataTable(
                id='table-labevents',
                columns=[{"name": i, "id": i }for i in lab_cols
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
                columns=[{"name": i, "id": i }for i in chart_cols
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
        dcc.Dropdown(list_cohorts,
                        [],
                        multi=False,
        id='dd-cohort',style={'width': '100%'}),
        html.Br(),
        dbc.Button("Load", color="primary", id='button-load-cohort'),

        html.Br(),
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
        html.H4('most frequent DRG codes'),
        dcc.Graph(figure={}, id='m2-graph-box-drgcodes')
    ], width=4),
    dbc.Col([
        html.H4('most frequent diagnoses (icd codes)'),
        dcc.Graph(figure={}, id='m2-graph-box-icd_diagnoses')
    ], width=4),
    dbc.Col([
        html.H4('most frequent procedures (icd codes)'),
        dcc.Graph(figure={}, id='m2-graph-box-icd_procedures')
    ], width=4),

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
                    'label',
                    multi=False,
                    id='dd-bio-x',style={'width': '100%'}),
                
                html.Br(),
                html.H6("y axis", className="card-text", style={}),
                dcc.Dropdown([
                    {'label': 'Mean of measurement intervals', 'value': 'mean'},
                    {'label': 'Median of measurement intervals', 'value': 'median'},
                    {'label': 'Counts', 'value': 'counts'},
                    {'label': 'Bar chart', 'value': 'total counts'},
                    {'label': 'latency', 'value': 'latency'}],
                    'median',
                    multi=False,
                    id='dd-bio-y',style={'width': '100%'}),
                
                html.Br(),
                html.H6("color", className="card-text", style={}),
                dcc.Dropdown(['label','careunit'],
                    'careunit',
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
        ]),

        dbc.Row([
            dbc.Col([
                dcc.Graph(figure={}, id='graph-bio-scatter')


            ], width=12),
        ])
        
    ])



# tab_cohort_le
tab_var_sel = dbc.Row([

    dbc.Col([
        # html.H4("icd_diagnoses", style={'text-align': 'left'}),
        # html.H5("Billed ICD-9/ICD-10 diagnoses for hospitalizations.", style={'text-align': 'left'}),
        dbc.Button("Load", outline=True, n_clicks=1, n_clicks_timestamp=0, color="primary", id='m2-button-load_vars_toselect'),
        dbc.ButtonGroup([
            dbc.Button("Select all", outline=True, n_clicks=1, n_clicks_timestamp=0, color="primary", id='m2-var_selection-select-all'),
            dbc.Button("Deselect all", outline=True, n_clicks=1, n_clicks_timestamp=0, color="primary", id='m2-var_selection-deselect-all'),    
        ]),
        dcc.Input(id="m2-name_vars_tosave", type="text", placeholder="", style={'marginRight':'10px'}),
        dbc.Button("save_vars", outline=True, n_clicks=1, n_clicks_timestamp=0, color="primary", id='m2-var_selection'),
        dcc.Input(id="m2-retrieve-table", type="text", placeholder="", style={'marginRight':'10px'}),
        # dbc.Button("Retrieve", outline=True, n_clicks=1, n_clicks_timestamp=0, color="primary", id='m2-retrieve-from-file'),

        dash_table.DataTable(
            id='m2-table-var_selection',
            columns=[{"name": 'd', "id": 'dfds', "deletable": True, "selectable": True}
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
            # page_size= 10,
            # style_table={'width': '100%', 'overflowY': 'auto'},
            style_data={
                'whiteSpace': 'normal',
                'height': 'auto',
            },
            **kwargs_tables,
        ),
    ], width=12),

   

])

tab_overview_tables = dbc.Row([
    dbc.Tabs([
        # dbc.Tab(tab_all_filters, label='ALL'),
        dbc.Tab(tab_var_sel, label='Variable Selection'),
        # dbc.Tab([tab_cohort_emar], label='EMAR'),
        # dbc.Tab(tab_cohort_che, label='Chart Events'),
        # dbc.Tab(tab_cohort_ie, label='Input Events'),
        # dbc.Tab(tab_cohort_pe, label='Procedure Events'),
    ]),
])




tab_overview = dbc.Tabs([
    dbc.Tab([  tab_overview_demo ], label='Demographics' ),
    dbc.Tab([  tab_overview_bio ], label='Biomarkers' ),
    dbc.Tab([  tab_overview_tables ], label='Tables' ),

    ], className="mt-3",
)


tab_hospstay = dbc.Accordion([
    dbc.AccordionItem([
            html.H5("Select the hamd_id", className="card-text", style={}),
            dcc.Dropdown([20412370],
                            20412370,
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
                dbc.Button("Panel (S)", n_clicks=1, n_clicks_timestamp=0, color="primary", id='button-add-panel-S'),
                dbc.Button("Panel (L)", n_clicks=1, n_clicks_timestamp=0, color="primary", id='button-add-panel-L'),    
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
                        html.H2("Module > Cohort Visualizer", style={'text-align': 'left'}),
                    ],className='header-desc'),
                ],width=8),
                
                dbc.Col([
                    

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
    html.Div(id='m2-hidden1'),

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

# load an excel file for variable selection

@app.callback(

    # table for variable selection
    Output(component_id='m2-table-var_selection', component_property='data'),
    Output(component_id='m2-table-var_selection', component_property='columns'),
    Input('m2-button-load_vars_toselect', 'n_clicks'),
    State('m2-retrieve-table','value'),
    prevent_initial_call=True
)
def load_VARS_ALL(n_clicks,ret_name):

    # ret_name = "VARS_pre"
    df_new = pd.read_csv(ADD_DATA+'VARS_ALL.csv')
    df_new = df_new.loc[:,~df_new.columns.str.startswith('Unnamed')]

    df_final = df_new
    if ret_name is not None:

        try:
            df_ret = pd.read_csv(ADD_DATA+ ret_name +'.csv')
            df_ret = df_ret.loc[:,~df_ret.columns.str.startswith('Unnamed')]

        except:
            print('bad')
        df_ret = df_ret[df_ret['selected']==1]
        df_final = pd.concat([df_new, df_ret])
    # dict_ = df_final.to_dict('records')
    # cols_ = [{"name": i, "id": i, "deletable": True, "selectable": True} for i in df_final.columns]
    dict_var_selection, cols_var_selection = hk_psql.df_to_dashTable(df_final)
    return dict_var_selection, cols_var_selection

# # load an excel file to retrieve

# @app.callback(

#     # table for variable selection

#     Output('m2-table-var_selection', 'selected_rows'),
#     Input('m2-retrieve-from-file', 'n_clicks'),
#     State('m2-retrieve-table','value'),
#     State('m2-table-var_selection', 'data'),

#     prevent_initial_call=True
# )
# def retrieve_VARS_ALL(n_clicks,ret_name,current_table):

#     try:
#         df_ret = pd.read_csv(ADD_DATA+ ret_name +'.csv')
#     except:
#         raise warning(f"retrieve table not foundt")

#     df_ret = df_ret[df_ret['selected']==1]

#     print(current_table)

#     selected_rows = []

#     return selected_rows


# load hadm
@app.callback(

    Output('dict_hadm', 'data'),

    Output('table-labevents', 'data'),
    # Output('table-labevents', 'columns'),
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

    print(dict_hadm['mimic_hosp']['labevents'])



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
    # dict_labevents, cols_labevents = hk_psql.df_to_dashTable(df_hosp_summary)
    # dict_chartevents, cols_chartevents = hk_psql.df_to_dashTable(df_icu_summary)
    
    # sel_labevents = ['itemid', 'ref_range_lower', 'ref_range_upper','flag']
    # df_temp = dict_hadm['mimic_hosp']['labevents'][sel_labevents]
    # df_count_flag =  df_temp.groupby('itemid')['flag'].count().reset_index(name='count_abnormal')
    # df_count =  df_temp.groupby('itemid').size().reset_index(name='count')
    # df_temp = pd.merge(df_temp, df_count)
    # df_temp = pd.merge(df_temp, df_count_flag)
    
    
    
    dict_labevents, cols_labevents = hk_psql.df_to_dashTable(dict_hadm['mimic_hosp']['labevents'], adm_time)
    print(cols_labevents)
    
    # cols_labevents = ['itemid', 'label','count','ref_range_lower', 'ref_range_upper','flag']
    
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
        dict_labevents,\
        dict_chartevents, cols_chartevents,\
        dict_inputevents, cols_inputevents,\
        dict_procedureevents, cols_procedureevents,\
        dict_drgcodes, cols_drgcodes, \
        dict_diagnoses_icd, cols_diagnoses_icd, \
        dict_procedures_icd, cols_procedures_icd, \
            dict_tra_summary, tbl_cols_tra, tra_selected_rows,\
             fig_transfers,\
             


# updating panel drop downs from table
@app.callback(

    # Output(component_id={'type': 'dynamic-panel-graph', 'index': MATCH}, component_property='figure'),
    Output(component_id={'type': 'dynamic-dd-hosp-axisL', 'index': MATCH}, component_property='options'),
    Output(component_id={'type': 'dynamic-dd-hosp-axisR', 'index': MATCH}, component_property='options'),
    
    # Input(component_id={'type': 'dynamic-dd-hosp-axisL', 'index': MATCH}, component_property='value'),
    # Input(component_id={'type': 'dynamic-dd-hosp-axisR', 'index': MATCH}, component_property='value'),
    # Input(component_id={'type': 'slider-panel-width', 'index': MATCH}, component_property='value'),
    # Input(component_id={'type': 'slider-subplot1-height', 'index': MATCH}, component_property='value'),
    # Input(component_id={'type': 'slider-subplot2-height', 'index': MATCH}, component_property='value'),
    # Input(component_id={'type': 'dynamic-panel-graph', 'index': MATCH}, component_property='figure'),
    
    Input('table-labevents', "derived_virtual_data"),
    Input('table-labevents', "derived_virtual_selected_rows"),
    Input('table-chartevents', "derived_virtual_data"),
    Input('table-chartevents', "derived_virtual_selected_rows"),
    # Input('table-inputevents', "derived_virtual_data"),
    # Input('table-inputevents', "derived_virtual_selected_rows"),
    # Input('table-procedureevents', "derived_virtual_data"),
    # Input('table-procedureevents', "derived_virtual_selected_rows"),
    
    
    # Input('table-transfers', "derived_virtual_data"),
    # Input('table-transfers', "derived_virtual_selected_rows"),

    prevent_initial_call=True

    )

def update_panel_dropdowns(tbl_labevents_data, tbl_labevents_row,\
         tbl_chartevents_data, tbl_chartevents_row):
    # print(dd_axisL)
    df_labevents_filterd = pd.DataFrame.from_dict(tbl_labevents_data)
    df_labevents_filterd = df_labevents_filterd.iloc[tbl_labevents_row]

    print(df_labevents_filterd.dtypes)

    df_chartevents_filterd = pd.DataFrame.from_dict(tbl_chartevents_data)
    df_chartevents_filterd = df_chartevents_filterd.iloc[tbl_chartevents_row]

    
    
    
    df_concat = pd.concat([df_labevents_filterd, df_chartevents_filterd])
    dd_options = {row['itemid']: row['label'] for _,row in df_concat[['itemid', 'label']].iterrows()}
    # print(dd_options)


    return dd_options, dd_options

# updating panel graph
@app.callback(

    Output(component_id={'type': 'dynamic-panel-graph', 'index': MATCH}, component_property='figure'),
    # Output(component_id={'type': 'dynamic-dd-hosp-axisL', 'index': MATCH}, component_property='options'),
    # Output(component_id={'type': 'dynamic-dd-hosp-axisR', 'index': MATCH}, component_property='options'),
    
    Input(component_id={'type': 'dynamic-dd-hosp-axisL', 'index': MATCH}, component_property='value'),
    Input(component_id={'type': 'dynamic-dd-hosp-axisR', 'index': MATCH}, component_property='value'),
    Input(component_id={'type': 'slider-panel-width', 'index': MATCH}, component_property='value'),
    Input(component_id={'type': 'slider-subplot1-height', 'index': MATCH}, component_property='value'),
    Input(component_id={'type': 'slider-subplot2-height', 'index': MATCH}, component_property='value'),
    Input(component_id={'type': 'dynamic-panel-graph', 'index': MATCH}, component_property='figure'),
    
    # Input('table-labevents', "derived_virtual_data"),
    # Input('table-labevents', "derived_virtual_selected_rows"),
    # Input('table-chartevents', "derived_virtual_data"),
    # Input('table-chartevents', "derived_virtual_selected_rows"),
    Input('table-inputevents', "derived_virtual_data"),
    Input('table-inputevents', "derived_virtual_selected_rows"),
    Input('table-procedureevents', "derived_virtual_data"),
    Input('table-procedureevents', "derived_virtual_selected_rows"),
    
    
    Input('table-transfers', "derived_virtual_data"),
    Input('table-transfers', "derived_virtual_selected_rows"),

    prevent_initial_call=True

    )

def update_panel_graph(dd_axisL, dd_axisR, w, h1, h2,graph1,\
    tbl_inputevents_data, tbl_inputevents_row,\
                 tbl_procedureevents_data, tbl_procedureevents_row,\
                    tbl_transfers_data, tbl_transfers_row):
    # if len(sel_lab)==0:
    #     raise PreventUpdate
    print('ZZZZZZZZZZZZZZZZZZZ')

    
    df_inputevents_filterd = pd.DataFrame.from_dict(tbl_inputevents_data)
    df_inputevents_filterd = df_inputevents_filterd.iloc[tbl_inputevents_row]
    df_inputevents_filterd = df_inputevents_filterd.rename(columns={"starttime": "x_start", "endtime": "x_end", "label": "y"})
    df_inputevents_filterd['color'] = df_inputevents_filterd['y']

    df_procedureevents_filterd = pd.DataFrame.from_dict(tbl_procedureevents_data)
    df_procedureevents_filterd = df_procedureevents_filterd.iloc[tbl_procedureevents_row]
    df_procedureevents_filterd = df_procedureevents_filterd.rename(columns={"starttime": "x_start", "endtime": "x_end", "label": "y"})
    df_procedureevents_filterd['color'] = df_procedureevents_filterd['y']
    

    

    df_transfers_filterd = pd.DataFrame.from_dict(tbl_transfers_data)
    df_transfers_filterd = df_transfers_filterd.iloc[tbl_transfers_row]
    print(df_transfers_filterd)
    x_range = [df_transfers_filterd['intime'].min(), df_transfers_filterd['outtime'].max()]
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
    

    

    data_left = {'x':[], 'y':[], 'label':[], 'normal_range':[]}    
    data_left = hk_psql.read_from_itemid(dict_hadm, dd_axisL)


        




    data_right = {'x':[], 'y':[], 'label':[], 'normal_range':[]}    
    data_right = hk_psql.read_from_itemid(dict_hadm, dd_axisR)

    

    df_tra = dict_hadm['mimic_core']['transfers']
    df_tra_summary, _  = hk_psql.tra_summary(df_tra)

    df_tra = df_tra.dropna(subset=['careunit'])
    df_tra = hk_psql.data2hour(df_tra, adm_time)

    df_tra = df_tra.rename(columns={"intime": "x_start", "outtime": "x_end", "careunit": "color"})
    df_tra['y'] = 'careunit'

    print(df_tra)
    

    
    

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


    return fig



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
                        html.H4(f"Panel {n_clicks}"),
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

                    ], width=4),

                    dbc.Col([
                        html.H6("Panel Width", className="card-subtitle"),
                               
                        dcc.Slider(1000, 2000,
                                value=1500,
                                # updatemode='drag',
                                id={
                                    'type': 'slider-panel-width',
                                    'index': n_clicks
                                },tooltip={"placement": "bottom"}
                        ),
                        
                        html.H6("H1", className="card-subtitle"),
                        dcc.Slider(200, 800,
                                value=400,
                                # updatemode='drag',
                                id={
                                    'type': 'slider-subplot1-height',
                                    'index': n_clicks
                                },tooltip={"placement": "bottom"}
                        ),
                        html.H6("H2", className="card-subtitle"),
                        dcc.Slider(100, 800,
                                value=200,
                                # updatemode='drag',
                                id={
                                    'type': 'slider-subplot2-height',
                                    'index': n_clicks
                                },tooltip={"placement": "bottom"}
                        ),
                
                    ], width=4),
                    

                ], justify="start", className="g-1"),
                
                
                # html.H6("Card subtitle", className="card-subtitle"),
                # html.P(
                #     "Some quick example text to build on the card title and make "
                #     "up the bulk of the card's content.",
                #     className="card-text",
                # ),

                
                dbc.Row([
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

    Output('m2-graph-box-drgcodes', 'figure'),
    Output('m2-graph-box-icd_diagnoses', 'figure'),
    Output('m2-graph-box-icd_procedures', 'figure'),



    Input('button-load-cohort', 'n_clicks'),
    State('dd-cohort', 'value'),
    

    prevent_initial_call=True

    )

def update_table_overview(n_clicks, sel_cohort):

    schema_core = sel_cohort+'_mimic_core'
    print(schema_core)
    
    df_overview = hk_psql.summary(schema_core, conn)
    hadm_ids = df_overview['hadm_id'].unique()
    print(df_overview)
    
    result = f"{len(df_overview)} hospital admissions has been found!"
    # print(df_overview) 
    # print(df_overview.dtypes) 
    table_lab_data=df_overview.to_dict('records')
    table_lab_columns=[{'id': c, 'name': c} for c in df_overview.columns]
    
    
    # q=f"""
    # select * from mimic_core.patients t1
    # inner join {schema_core}.admissions t2
    # on t1.subject_id = t2.subject_id
    # where t2.hadm_id in ({str(hadm_ids.tolist())[1:-1]})
    
    # """

    # new version has the patient table (from mimic)
    q=f"""
    select * from {schema_core}.patients t1
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
    fig_age_box = px.violin(df_patients, y="anchor_age",labels={'anchor_age': 'Age'} , title='Age boxplot', box=True)

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
    # df_transfers.to_csv(ADD_DATA+'tr.csv')


    df_temp = df_transfers.groupby('hadm_id')['los'].sum().reset_index(name ='LOS (hours)')
    graph_box_los_per_hadm = px.box(df_temp,  y="LOS (hours)", points="all", hover_data=["hadm_id"])

    
    
    # df_temp = df_transfers.groupby(['transfer_id','hadm_id'])['los'].sum().reset_index(name ='LOS (hours)')
    # sort boxplot by decesing median
    df_temp = df_transfers.groupby('careunit')['los'].median().reset_index(name='median')
    df_temp = pd.merge(df_transfers, df_temp).sort_values('median', ascending=False)
    graph_box_los_per_careunit = px.box(df_temp, x='careunit',  y="los", color='careunit', points="all", range_y=[0,75], hover_data=["hadm_id",'transfer_id'])
    graph_box_los_per_careunit = px.violin(df_temp, x='careunit',  y="los", color='careunit', box=True, range_y=[0,75], hover_data=["hadm_id",'transfer_id'])
    graph_box_los_per_careunit.update_xaxes(tickangle=45)




    fig_transfers_los_box = px.box(df_transfers,x='careunit',  y="los", color='careunit', points="all")
    fig_transfers_los_box.update_xaxes(tickangle=45)

    df_temp1 = df_transfers.groupby('careunit')['los'].sum().reset_index(name ='sum (hours)').sort_values('sum (hours)',ascending=False).iloc[:10]
    df_temp2 = df_transfers.groupby('careunit').size().reset_index(name ='count').sort_values('count',ascending=False).iloc[:10]
    
    df_temp = pd.merge(df_temp1,df_temp2)
    # df_temp.to_csv(ADD_DATA+'df_temp.csv')

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
    itemids=[50813, 50889, 51003, 50963, 50924, 50909, 50910, 50911]
    df_le = df_le[df_le['itemid'].isin(itemids)]
    df_le['label'] = hk_psql.lookup_itemid(df_le['itemid'].tolist(), type=None)
    
    df_le = df_le.sort_values(['hadm_id', 'charttime'])

    # converting time to hours since admission
    df_le = pd.merge(df_le, df_adm[['hadm_id', 'admittime', 'dischtime']] )
    df_le['charttime'] = df_le['charttime'] - df_le['admittime']
    df_le['charttime'] = round((df_le['charttime']) / np.timedelta64(1,'h'),2)
    df_le['storetime'] = df_le['storetime'] - df_le['admittime']
    df_le['storetime'] = round((df_le['storetime']) / np.timedelta64(1,'h'),2)
    
    # saving difference between two consecutive measurements
    df_le['diff'] = df_le.groupby(['hadm_id','itemid'])['charttime'].diff()
    # saving latency between charttime and storetime
    df_le['latency'] = df_le['storetime'] - df_le['charttime']

    df_le = df_le.sort_values(['itemid','hadm_id','charttime'])
    df_le.to_csv(ADD_DATA+'dffff.csv')


    print(df_le)
    print(df_transfers)

    # assigning each measurement to a transfer_id
    df_le.to_csv(ADD_DATA+'df_le.csv')
    df_transfers.to_csv(ADD_DATA+'df_transfers.csv')

    df_le = hk_psql.cut(df_le, df_transfers)

    print(df_le)
    print(df_transfers)
    print('CHECK1')
    global df1_le

    df1_le = df_le



    global df1_transfers

    df1_transfers = df_transfers

    df1_le.to_csv(ADD_DATA+'df1_le.csv')
    print('CHECK1')
    df1_transfers.to_csv(ADD_DATA+'df1_transfers.csv')

    q=f"""
        select * from {sel_cohort+'_mimic_hosp'}.drgcodes         
        """

    df_drg = hk_psql.query(q, conn)
    df_temp = df_drg.groupby('drg_code').size().reset_index(name='count_drg').sort_values('count_drg', ascending=False)
    df_temp = df_temp.head(5)
    # df_temp = df_temp[df_temp['count_drg']>10]
    print(df_temp)
    df_drg=pd.merge(df_drg, df_temp)
    print(df_drg)
    fig_drg = px.bar(df_temp, x='drg_code', y='count_drg')

    q=f"""
        select * from {sel_cohort+'_mimic_hosp'}.diagnoses_icd         
        """

    df_diag = hk_psql.query(q, conn)
    df_diag = df_diag[df_diag['seq_num']<=5]
    df_temp = df_diag.groupby(['seq_num','icd_code']).size().reset_index(name='count_diag').sort_values('count_diag', ascending=False)
    df_temp = df_temp.groupby(['seq_num']).head(5)
    # df_temp = df_temp[df_temp['count_diag']>10]
    print(df_temp)
    df_diag=pd.merge(df_diag, df_temp)
    print(df_diag)
    fig_diag = px.histogram(df_temp, x='seq_num', y='count_diag', color='icd_code',barmode='group')

    q=f"""
        select * from {sel_cohort+'_mimic_hosp'}.procedures_icd         
        """

    df_proc = hk_psql.query(q, conn)
    df_proc = df_proc[df_proc['seq_num']<=5]
    print('JHHHHHHHHHHHHHHHHH')
    df_temp = df_proc.groupby(['seq_num','icd_code']).size().reset_index(name='count_proc').sort_values(['seq_num','count_proc'], ascending= [True, False])
    print(df_temp)

    df_temp = df_temp.groupby(['seq_num']).head(5)
    print(df_temp)
    # df_temp = df_temp[df_temp['count_proc']>10]
    # df_temp = df_temp.sort_values('seq_num')
    print(df_temp)
    df_proc=pd.merge(df_proc, df_temp)
    print(df_proc)
    fig_proc = px.histogram(df_temp, x='seq_num', y='count_proc', color='icd_code',barmode='group')


    # fig_gender = fig_age
    return table_lab_data, table_lab_columns, result, hadm_ids, sel_cohort,\
        fig_age_hist, fig_age_box, fig_gender,\
             fig_transfers_sum_los_pie,fig_transfers_count_pie,\
                 graph_box_los_per_hadm,graph_box_los_per_careunit,\
                     fig_drg,fig_diag,fig_proc
            

@app.callback(  

    Output('graph-bio-box', 'figure'),
    # Output('graph-bio-scatter', 'figure'),

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
    df1_le= pd.read_csv(ADD_DATA+'df1_le.csv')
    df1_transfers = pd.read_csv(ADD_DATA+'df1_transfers.csv')

    print(x)
    print(y)
    print(color)
    print('1')
    df = df1_le.copy()

    g=['label', 'hadm_id', 'transfer_id']


    # print(g)
    temp = [x, color] if x!=color else [x]
    # print(temp)
    # print("DDDDDDDDDDDDD")
    
    
    # print(df_count_x)
    # print(df_count_color)
    # print(df_count_x_color)
    print('2')
    y_label = 'counts'
    title = 'boxplot for number of measurements in each hospital stay'
 
    df_size = df.groupby(g).size().reset_index(name='counts')#.sort_values(['label','counts'], ascending=False)
    df_diff_describe = df_size
    print('2.1')
    # df_diff_describe = df.groupby(g)[['valuenum', 'diff']].describe().reset_index()
    if y=='median':
        y_label = 'median(hour)'
        title = 'boxplot for median of measurement intervals in each hospital stay'
    
        df_diff_describe = df.groupby(g)['diff'].median().reset_index(name='median')
    elif y=='mean':
        y_label = 'mean(hour)'
        title = 'boxplot for mean of measurement intervals in each hospital stay'
    
        df_diff_describe = df.groupby(g)['diff'].mean().reset_index(name='mean')
    elif y=='latency':
        y_label = 'latency(hour)'
        title = 'boxplot for mean of latency (storetime-charttime) in each hospital stay'
    
        df_diff_describe = df.groupby(g)['latency'].mean().reset_index(name='latency')

    # df_diff_describe = df_diff_describe.rename(columns={'valuenum':'valuenum_median', 'diff':'diff_median'})
    print(df_diff_describe)
    print(df_size)
    print('2.2')
    # df_diff_describe.columns = ['_'.join(col) if col[1] !='' else ''.join(col) for col in df_diff_describe.columns ]

    df = pd.merge(df_size, df_diff_describe)
    print('3')
    # print(df)
    # print(df1_transfers)
    df = pd.merge(df, df1_transfers[['transfer_id', 'careunit', 'los']])

    # if 'transfer_id' in g:
        
    #     df1 = df.groupby(['label', 'careunit']).size().reset_index(name='counts')#.sort_values(['label', 'counts'], ascending=False)
    #     df2 = df1.groupby(['label', 'counts']).head(5).reset_index(drop=True)
    #     df2 = df1.groupby(['label'])['counts'].nlargest(5).reset_index(drop=True)
    #     df2.to_csv(ADD_DATA+'df2.csv')
    
    # print(df)
    df = df[df['counts']>=min_count]
    df = df[df['los'].between(los_range[0], los_range[1])]
    
    df_count_x = df.groupby(temp[0]).size().reset_index(name='count_x')#.sort_values(['count_x'], ascending=False)
    df_count_color = df.groupby(temp).size().reset_index(name='count_color')#.sort_values(['count_x'], ascending=False)
    df_count_x_color = pd.merge(df_count_color, df_count_x).sort_values(['count_x','count_color'], ascending=False)
    
    df = pd.merge(df, df_count_x_color).sort_values(['count_x','count_color'], ascending=False)
    # print(df)
    # df.to_csv(ADD_DATA+'df.csv')
    # print(df)
    
    print('4')






   
    
    # print(df)
    if y=='total counts':
        
        df = df.drop_duplicates([*temp,'count_x'])
        # print(df)
        fig_bio_box = px.bar(df, x=x, y='count_color', color=color, title="Total counts")
    else:
        print(df)
        fig_bio_box = px.box(df, x=x, y=y, color=color, points="all",
            labels={    y: y_label,    },   title=title, hover_data=['counts',"hadm_id",'transfer_id','los']  )

    tids = df['transfer_id'].unique().tolist()
    # for tid in tids[:10]:
    df = df1_le[df1_le['transfer_id'].isin(tids[:10])]
    df = df[df['label']=='Lactate']
    # df = df1_le[df1_le['transfer_id']==tid and df1_le['label']=='Lactate']
    
    df.loc[df.groupby('transfer_id')['diff'].head(1).index, 'diff'] = np.nan
    df['diff'] = df['diff'].fillna(0)
    # print(df)
    df['time'] = df.groupby(['transfer_id', 'label'])['diff'].cumsum()
    df.loc[df.groupby('transfer_id')['diff'].head(1).index, 'diff'] = np.nan
    print(df)
    # print(df)

    fig_bio_scatter = px.line(df, x='time', y='valuenum', color='transfer_id', markers=True)
    return fig_bio_box #, fig_bio_scatter


@app.callback(  

    # Output('graph-bio-box', 'figure'),
    Output('graph-bio-scatter', 'figure'),

    # Input(component_id='button-bio-summary', component_property= 'n_clicks'),
    # State(component_id='dd-bio-x', component_property= 'value'),
    # State(component_id='dd-bio-y', component_property= 'value'),
    # State(component_id='dd-bio-color', component_property= 'value'),
    # State('slider-min-count', 'value'),
    # State('slider-range-los', 'value'),
    Input('graph-bio-box','selectedData'),
    prevent_initial_call=True

    ) 
def plot_bio_scatter(dict_data):

    print('plot_bio_scatter')

    global df1_le
    global df1_transfers
    df = pd.DataFrame.from_dict(dict_data['points'])
    print(df)
    tids = []
    for index, row in df.iterrows():
        # print(row)
        Label = row['x']
        tid = row['customdata'][2]
        tids.append(tid)
   
   
   
   
    # df1_le.to_csv(ADD_DATA+'df1_le.csv')
    # df1_transfers.to_csv(ADD_DATA+'df1_transfers.csv')
    df1_le= pd.read_csv(ADD_DATA+'df1_le.csv')
    df1_transfers = pd.read_csv(ADD_DATA+'df1_transfers.csv')

    
    print(tids)

    df = df1_le[df1_le['transfer_id'].isin(tids[:])]
    df = df[df['label']==Label]
    
    df.loc[df.groupby('transfer_id')['diff'].head(1).index, 'diff'] = np.nan
    df['diff'] = df['diff'].fillna(0)
    # print(df)
    df['time'] = df.groupby(['transfer_id', 'label'])['diff'].cumsum()
    df.loc[df.groupby('transfer_id')['diff'].head(1).index, 'diff'] = np.nan
    print(df[['time','valuenum','transfer_id']])
    # print(df)
    
    fig_bio_scatter = px.line(df, x='time', y='valuenum', color='transfer_id', markers=True, title=f'<{Label}> trajectories for selected careunits')
    
    print(df)
    ref_low = df['ref_range_lower'].iloc[0]
    ref_up = df['ref_range_upper'].iloc[0]
    fig_bio_scatter.add_hrect(y0=ref_low, y1=ref_up, line_width=0, fillcolor="green", opacity=0.2)
    
    
    
    # fig_bio_scatter.update_layout(hovermode='x unified')
    
    fig_bio_scatter.update_xaxes(showspikes=True)
    fig_bio_scatter.update_yaxes(showspikes=True)
    return fig_bio_scatter








@app.callback(
    Output('m2-table-var_selection', 'selected_rows'),
    Input('m2-var_selection-select-all', 'n_clicks'),
    Input('m2-var_selection-deselect-all', 'n_clicks'),
    
    State('m2-table-var_selection', 'data'),
    State('m2-table-var_selection', 'derived_virtual_data'),
    State('m2-table-var_selection', 'derived_virtual_selected_rows'),
    State('m2-table-var_selection', 'selected_rows'),
    prevent_initial_call=True

    )
def vars_select_des_all(select_n_clicks, deselect_n_clicks, original_rows, filtered_rows, selected_rows,old_selected_rows):
    print('hi')
    ctx = dash.callback_context.triggered[0]
    ctx_caller = ctx['prop_id']

    selected_ids = [row for row in filtered_rows]

    new_rows = [i for i, row in enumerate(original_rows) if row in selected_ids]
  
    if filtered_rows is not None:
        if ctx_caller == 'm2-var_selection-select-all.n_clicks':
            # logger.info("Selecting all rows..")

            temp = [*old_selected_rows, *new_rows]

            new_selected_rows = list(set(temp))  
            return new_selected_rows
        if ctx_caller == 'm2-var_selection-deselect-all.n_clicks':
            # logger.info("Deselecting all rows..")
            new_selected_rows = [i for i in old_selected_rows if i not in new_rows]

            return new_selected_rows
        raise PreventUpdate
    else:
        raise PreventUpdate







@app.callback(
    Output(component_id='m2-hidden1', component_property= 'children'),
    Input('m2-var_selection', 'n_clicks'),
    
    State('m2-table-var_selection', 'data'),

    State('m2-table-var_selection', 'selected_rows'),
    State('m2-name_vars_tosave', 'value'),

    prevent_initial_call=True

    )


def save_varsds(n_clicks, data, selected_rows, name2save='backup' ):

    print('hi')

    print(selected_rows)
    
    df = pd.DataFrame.from_dict(data)
    print(df.dtypes)
    
    print(df.iloc[selected_rows,:])
    df['selected'].iloc[selected_rows]=1
    print(df.iloc[selected_rows,:])

    df.iloc[selected_rows,:].to_csv(ADD_DATA+f'VARS_{name2save}.csv')
    df.iloc[selected_rows,:].to_csv(ADD_DATA+f'VARS_selected.csv')


    msg = f"data saved"



    raise PreventUpdate






