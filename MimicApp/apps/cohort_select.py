# Import libraries
from sre_parse import State
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
import plotly.graph_objects as go
from dash import Dash,dash_table, dcc, html, Input, Output, State  # pip install dash (version 2.0.0 or higher)
import dash_bootstrap_components as dbc
import plotly.express as px
import dash
from app import app

print("DDDDDDDDD")
print(app)
ADD_DATA = "C:\\DATA\\data\\raw\\mimic4\\lookup\\"
d_labitems = pd.read_csv(ADD_DATA+'d_labitems.csv')
d_icd_diagnoses = pd.read_csv(ADD_DATA+'d_icd_diagnoses.csv')
d_icd_procedures = pd.read_csv(ADD_DATA+'d_icd_procedures.csv')
d_drgcodes = pd.read_csv(ADD_DATA+'d_drgcodes.csv', dtype={'drg_code': object})

d_items = pd.read_csv(ADD_DATA+'d_items.csv')
icustays = pd.read_csv(ADD_DATA+'icustays.csv')
digi_bio = pd.read_csv(ADD_DATA+'digi_bio.csv')


adm_types = pd.read_csv(ADD_DATA+'adm_types.csv')
adm_locs = pd.read_csv(ADD_DATA+'adm_locs.csv')
dis_locs = pd.read_csv(ADD_DATA+'dis_loc.csv')

print(dis_locs)

conn= None
flag=0






app = Dash(external_stylesheets=[dbc.themes.BOOTSTRAP])

app = Dash(__name__)

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




tab_all_filters = dbc.Row([
    dbc.Button("Update table", color="primary", className="me-1",n_clicks=1, id='update-table-button'),

    dash_table.DataTable(
        id='table-filters',
        columns=[{"name": 'id', "id": 'id'}, {"name": 'filter', "id": 'filter'}
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
        style_table={'width': '50%', 'overflowY': 'auto'},
        style_data={
            'whiteSpace': 'normal',
            'height': 'auto',
        },
    )
])





tab_core_patients = dbc.Row([
    dbc.Col([
        html.H4("Age", style={'text-align': 'left'}),
        dcc.RangeSlider(0, 91, 10, value=[18, 70], id='slider-age'),
            
    ], width=4),

    dbc.Col([
        html.H4("Gender", style={'text-align': 'left'}),
        dcc.Checklist(
            {'M':'Male', 'F':'Female'},
            ['M', 'F'],
            inline=True,
            id = 'check_sex',
        ),
    ], width=4)            
            

])


tab_core_admissions = dbc.Row([
    dbc.Col([
            html.Br(),
            html.H4("Admission type: ", style={'text-align': 'left'}),
            dcc.Dropdown(adm_types['admission_type'].unique(),
                            [],
                            multi=True,
                            id='adm_types'),
    ], width=6),

    dbc.Col([
        
        html.Br(),
        html.H4("Admission location: ", style={'text-align': 'left'}),
        dcc.Dropdown(adm_locs['admission_location'].dropna().unique(),
                    [],
                    multi=True,
                    id='adm_locs'),

    ], width=6),

    dbc.Col([
            html.Br(),
            html.H4("Discharge location: ", style={'text-align': 'left'}),
            dcc.Dropdown(dis_locs['discharge_location'].unique(),
                            [],
                            multi=True,
                            id='dis_locs'),


    ], width=6),
    

])


tab_core_transfers = dbc.Row([

    dbc.Col([
        html.Br(),
        html.H4("Care unit", style={'text-align': 'left'}),
        dcc.Dropdown(icustays['first_careunit'].unique(),
                        'Medical Intensive Care Unit (MICU)',
                        multi=False,
                        # style={'padding': 10},
                        id='careunit-drop'),
        dbc.Button("Add", color="primary", className="me-1",n_clicks=1, id='add-careunit-button'),

        dash_table.DataTable(
            id='adding-careunit-table',
            columns=[
                {'name': 'Care unit', 'id': 'id_careunit', 'deletable': True, 'renamable': True},
                {'name': 'LOS min (h)', 'id': 'id_los_min', 'deletable': True, 'renamable': True},
                {'name': 'LOS max (h)', 'id': 'id_los_max', 'deletable': True, 'renamable': True},
            ],
            data=[
                {'id_careunit':'Medical Intensive Care Unit (MICU)', 'id_los_min':'5', 'id_los_max':'24'},
                
            ],
            editable=True,
            row_deletable=True
        ),
    ], width=6),
            

])



tab_hosp_labevents = dbc.Row([
    dbc.Col([
        html.H4("Lab items", style={'text-align': 'left'}),
    dcc.Dropdown(d_labitems['label'].unique(),
                    [],
                    multi=False,
                    # style={'padding': 10},
                    id='d_labitems-drop'),
    dbc.Button("Add", color="primary", className="me-1",n_clicks=1, id='add-lab-button'),

    dash_table.DataTable(
        id='adding-labs-table',
        columns=[
            {'name': 'item', 'id': 'id_item', 'deletable': True, 'renamable': True, 'editable' : False},
            {'name': 'Label', 'id': 'id_label', 'deletable': True, 'renamable': True, 'editable' : False},
            {'name': 'Fluid', 'id': 'id_fluid', 'deletable': True, 'renamable': True, 'editable' : False},
            {'name': 'Category', 'id': 'id_cat', 'deletable': True, 'renamable': True, 'editable' : False},
            {'name': 'Normal range', 'id': 'id_range', 'deletable': True, 'renamable': True, 'editable' : False},
            {'name': 'Unit', 'id': 'id_unit', 'deletable': True, 'renamable': True, 'editable' : False},
            {'name': 'condition', 'id': 'id_condition', 'deletable': True, 'renamable': True},
            {'name': 'counts', 'id': 'id_counts', 'deletable': True, 'renamable': True},
        ],
        data=[
            {'id_item': digi_bio['itemid'].iloc[i], 'id_label': digi_bio['label'].iloc[i], 'id_fluid':digi_bio['fluid'].iloc[i], 'id_cat':digi_bio['category'].iloc[i],
         'id_range':f"{digi_bio['ref_range_lower'].iloc[i]}-{digi_bio['ref_range_upper'].iloc[i]}" , 'id_unit':digi_bio['valueuom'].iloc[i],
          'id_condition': digi_bio['condition'].iloc[i], 'id_counts': digi_bio['counts'].iloc[i]
        } for i in range(len(digi_bio))
            
            
        ],
        editable=True,
        row_deletable=True
    ),

            
    ], width=4),

            

])



tab_hosp_drgcodes = dbc.Row([

    dbc.Col([
        html.H4("drgcodes", style={'text-align': 'left'}),
        dash_table.DataTable(
            id='table-drgcodes',
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
            page_size= 10,
            style_table={'width': '100%', 'overflowY': 'auto'},
            style_data={
                'whiteSpace': 'normal',
                'height': 'auto',
            },
        ),
    ], width=8),

    dbc.Col([
        html.H4("filter", style={'text-align': 'left'}),
        html.Div([
            dcc.Input(id="text-filter-drgcodes",
                placeholder="Debounce False",
                debounce=False,
                style={'width': '100%',
                'height': '300px',
                'margin-left': 20,
                'display': 'inline-block'}
            )
        ]),
    ], width=4)     

])


tab_hosp_icd_procedures = dbc.Row([

    dbc.Col([
        html.H4("icd_procedures", style={'text-align': 'left'}),
        dash_table.DataTable(
            id='table-icd_procedures',
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
            page_size= 10,
            style_table={'width': '100%', 'overflowY': 'auto'},
            style_data={
                'whiteSpace': 'normal',
                'height': 'auto',
            },
        ),
    ], width=8),

    # dbc.Col([
    #     html.H4("filter", style={'text-align': 'left'}),
    #     html.Div([
    #         dcc.Input(children=['type sth'], id="text-filter-drgcodes",
    #             placeholder="Debounce False",
    #             debounce=False,
    #             style={'width': '100%',
    #             'height': '300px',
    #             'margin-left': 20,
    #             'display': 'inline-block'}
    #         )
    #     ]),
    # ], width=4)     

])


tab_hosp_icd_diagnoses = dbc.Row([

    dbc.Col([
        html.H4("icd_diagnoses", style={'text-align': 'left'}),
        dash_table.DataTable(
            id='table-icd_diagnoses',
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
            page_size= 10,
            style_table={'width': '100%', 'overflowY': 'auto'},
            style_data={
                'whiteSpace': 'normal',
                'height': 'auto',
            },
        ),
    ], width=8),

    # dbc.Col([
    #     html.H4("filter", style={'text-align': 'left'}),
    #     html.Div([
    #         dcc.Input(children=['type sth'], id="text-filter-drgcodes",
    #             placeholder="Debounce False",
    #             debounce=False,
    #             style={'width': '100%',
    #             'height': '300px',
    #             'margin-left': 20,
    #             'display': 'inline-block'}
    #         )
    #     ]),
    # ], width=4)     

])


row_body_filt = html.Div([
    # html.Br(className='filt'),
    

    html.Div([
        html.H2("Filter", style={'text-align': 'left'}),
        dbc.Button('Apply filter', n_clicks=1, id='button_filter'),
    ]),
    
    dbc.Tabs([
        dbc.Tab(tab_all_filters, label='ALL'),
        dbc.Tab(tab_core_patients, label='core_patients'),
        dbc.Tab([tab_core_admissions], label='core_admissions'),
        dbc.Tab(tab_core_transfers, label='core_transfers'),
        
        dbc.Tab([tab_hosp_labevents], label='hosp_labevents'),
        dbc.Tab([tab_hosp_drgcodes], label='hosp_drgcodes'),
        dbc.Tab([tab_hosp_icd_diagnoses], label='hosp_diagnoses_icd'),
        dbc.Tab([tab_hosp_icd_procedures], label='hosp_procedures_icd'),
        
        # dbc.Tab([], label='icu_icustays'),
        # dbc.Tab([], label='icu_chartevents'),
        # dbc.Tab([], label='icu_inputevents'),
        # dbc.Tab([], label='icu_procedureevents'),


        # dbc.Tab(table_labevents, label='Lab events'),
        # dbc.Tab(table_chartevents, label='Chart events'),
        # dbc.Tab(table_inputvents, label='Input events'),
        # dbc.Tab(table_procedureevents, label='Procedure events'),
        # dbc.Tab(table_drgcodes, label='drgcodes'),
        # dbc.Tab(table_diagnoses_icd, label='diagnoses_icd'),
        # dbc.Tab(table_procedures_icd, label='procedures_icd'),
        # dbc.Tab(tab_vis, label='Visualization'),
    ]),

   
    


])

row_body_summary = html.Div([
        html.H2("Summary", style={'text-align': 'left'}),
        html.Div([
            dbc.Row([
                dbc.Col([
                    html.H4("Admissions", style={'text-align': 'left'}),
                    html.Li("", style={'text-align': 'left'},id='li-adm'),
                    dcc.Graph(id="graph-adm")
                ], style={'width': '30%', 'display': 'inline-block', 'outline': 'thin lightgrey solid', 'padding': 10},
                ),
                dbc.Col([
                    html.H4("Patients", style={'text-align': 'left'}),
                    html.Li("", style={'text-align': 'left'},id='li-pat'),
                    dcc.Graph(id="graph-pat")
                ], style={'width': '30%', 'display': 'inline-block', 'outline': 'thin lightgrey solid', 'padding': 10},
                ),

                dbc.Col([
                    html.H4("Age", style={'text-align': 'left'}),
                    dcc.Graph(id="graph-age")

                ], style={'width': '30%', 'display': 'inline-block', 'outline': 'thin lightgrey solid', 'padding': 10},
                ),

            ]),
            dbc.Row([

               
                dbc.Col([
                    html.H4("ICU stay", style={'text-align': 'left'}),
                    dcc.Graph(id="graph-icustay")

                ], style={'width': '45%', 'display': 'inline-block', 'outline': 'thin lightgrey solid', 'padding': 10},
                ),
            ])
        ])
    ])

row_body_bio = html.Div([
        html.H2("Bio", style={'text-align': 'left'}),
        dbc.Button('Update', id='update-bio', n_clicks=0),
        dcc.Dropdown(
            [],
            [],
            multi=True,
            id='list-bio'
        ),
        html.Div(id='container-bio', children=[])

        # html.Div([
            # dbc.Row([
            #     dbc.Col([
            #         html.H4("Admissions", style={'text-align': 'left'}),
            #         dcc.Graph(id="graph-adm")
            #     ]),
            #     dbc.Col([
            #         html.H4("Patients", style={'text-align': 'left'}),
            #         dcc.Graph(id="graph-pat")
            #     ]),

            #     dbc.Col([
            #         html.H4("Age", style={'text-align': 'left'}),
            #         dcc.Graph(id="graph-age")

            #     ]),

            # ]),
            # dbc.Row([

               
            #     dbc.Col([
            #         html.H4("ICU stay", style={'text-align': 'left'}),
            #         dcc.Graph(id="graph-icustay")

            #     ]),
            # ])
        # ])
    ])

row_body_save_cohort = dbc.Row([
    dbc.Label("Name", width="auto"),
    dbc.Col(
        dbc.Input(placeholder="Enter a valid name", size="md", className="mb-3", id='cohort-name'),
        className="me-3",
    ),
    
    dbc.Col(dbc.Button("Save Cohort", color="primary", className="me-1", id='button-save'), width="auto"),
    html.H4('', id='result-info')
],className="g-2")





row_header = dbc.Row([
                dbc.Col([
                    html.Div([
                    html.H1("MIMIC IV App", style={'text-align': 'left'}),        
                    ],className='header-title'),

                    html.Div([
                        html.H2("Module > Cohort Selection", style={'text-align': 'left'}),
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
    dbc.Accordion([
        dbc.AccordionItem([
                row_body_filt,
            ], title="Filter",
        ),
        dbc.AccordionItem([
                row_body_summary,
            ], title="Summary",
        ),
        dbc.AccordionItem([
                row_body_bio,
            ], title="Bio",
        ),
        dbc.AccordionItem([
                row_body_save_cohort,
            ], title="Save",
        ),
        
    ], start_collapsed=True,
    )
])

row_footer = dbc.Row([
                html.H2("Contact Me!"),
            ])








layout = dbc.Container([

    dcc.Store(id='df_filtered', data=[], storage_type='memory'), # 'local' or 'session'
    dcc.Store(id='memory-hadm_ids', data=[], storage_type='memory'), # 'local' or 'session'
    dcc.ConfirmDialog(
        id='confirm-danger',
        message='Filter applied',
    ),
    row_header,

    row_body,

    row_footer,

    

    
    
    

], fluid=False)




# ------------------------------------------------------------------------------
# Connect the Plotly graphs with Dash Components



# update filter table
@app.callback(  
    Output(component_id='table-filters', component_property='data'),
    
    Input(component_id='update-table-button', component_property= 'n_clicks'),

    State(component_id='slider-age', component_property= 'value'),
    State(component_id='check_sex', component_property= 'value'),

    State(component_id='adm_types', component_property= 'value'),
    State(component_id='adm_locs', component_property= 'value'),
    State(component_id='dis_locs', component_property= 'value'),

    prevent_initial_call=True

    ) 
def update_filter_table(n_clicks, sel_age, sel_sex, adm_types, adm_locs, dis_locs):

    sel_sex.append(' ')

    df = pd.DataFrame()
    i=0

    i=i+1
    df = df.append({'id': f"f{i}", 'cat':'age',
        'filter' : f"age>{sel_age[0]} and age<{sel_age[1]}"
    }, ignore_index=True)



    # if sel_sex is not None:
    i=i+1
    df = df.append({'id': f"f{i}", 'cat':'gender',
        'filter' : f" gender is {sel_sex}"
    }, ignore_index=True)

    if adm_types:
        i=i+1
        df = df.append({'id': f"f{i}", 'cat':'adm_types',
            'filter' : f" adm_types in {adm_types}"
        }, ignore_index=True)


    if adm_locs:
        i=i+1
        df = df.append({'id': f"f{i}", 'cat':'adm_locs',
            'filter' : f" adm_locs in {adm_locs}"
        }, ignore_index=True)

    if dis_locs:
        i=i+1
        df = df.append({'id': f"f{i}", 'cat':'dis_locs',
            'filter' : f" dis_locs in {dis_locs}"
        }, ignore_index=True)

    print(df)
    dict_, col_ = hk_psql.df_to_dashTable(df, adm_time=None)

    # q_core = hk_psql.bq_core(filters_core)

    return dict_

# connect to psql
@app.callback(  
    Output(component_id='button-connect', component_property='children'),
    Output(component_id='button-connect', component_property='color'),
    Output(component_id='table-drgcodes', component_property='data'),
    Output(component_id='table-drgcodes', component_property='columns'),
    Output(component_id='table-icd_diagnoses', component_property='data'),
    Output(component_id='table-icd_diagnoses', component_property='columns'),
    Output(component_id='table-icd_procedures', component_property='data'),
    Output(component_id='table-icd_procedures', component_property='columns'),
    Input(component_id='button-connect', component_property= 'n_clicks'),


    prevent_initial_call=True

    ) 
def connect_to_psql(n_clicks):
    print(n_clicks)


    if n_clicks>0:
        global conn
        # print(n_clicks)
        # print(conn)
        print(d_drgcodes.dtypes)
        print(d_icd_diagnoses.dtypes)
        print(d_icd_procedures.dtypes)
        dict_drgcodes, cols_drgcodes = hk_psql.df_to_dashTable(d_drgcodes)
        dict_icd_diagnoses, cols_icd_diagnoses = hk_psql.df_to_dashTable(d_icd_diagnoses)
        dict_icd_procedures, cols_icd_procedures = hk_psql.df_to_dashTable(d_icd_procedures)

        conn = hk_psql.connect_psql('mimic')

    return 'Connected', 'success', dict_drgcodes, cols_drgcodes,\
        dict_icd_diagnoses, cols_icd_diagnoses,\
            dict_icd_procedures, cols_icd_procedures


@app.callback(
    Output(component_id='graph-adm', component_property='figure'),
    Output(component_id='graph-pat', component_property='figure'),
    Output(component_id='graph-age', component_property='figure'),
    Output(component_id='graph-icustay', component_property='figure'),
    Output('list-bio', 'value'),
    Output(component_id='df_filtered', component_property= 'data'),
    Output(component_id='container-bio', component_property= 'children'),
    Output(component_id='memory-hadm_ids', component_property= 'data'),
    Output(component_id='confirm-danger', component_property= 'displayed'),
    Output(component_id='li-adm', component_property= 'children'),
    Output(component_id='li-pat', component_property= 'children'),
    # Output(component_id='store-conn', component_property='data'),
    # Output(component_id='stat_connection', component_property='children'),
    # Output(component_id='stat_connection', component_property='children'),
    Input(component_id='button_filter', component_property= 'n_clicks'),
    # Input(component_id='container-bio', component_property= 'children'),

    State(component_id='d_labitems-drop', component_property= 'value'),
    State(component_id='slider-age', component_property= 'value'),
    State(component_id='check_sex', component_property= 'value'),
    State(component_id='adding-careunit-table', component_property= 'data'),
    State(component_id='adm_types', component_property= 'value'),
    State(component_id='adm_locs', component_property= 'value'),
    State(component_id='dis_locs', component_property= 'value'),
    State(component_id='df_filtered', component_property= 'data'),

    State(component_id='adding-labs-table', component_property= 'data'),

    # State('text-filter-drgcodes', "value"),
    # State('table-drgcodes', "derived_virtual_selected_rows"),
    State('table-drgcodes', "derived_virtual_data"),
    State('table-drgcodes', "derived_virtual_selected_rows"),
    State('table-icd_procedures', "derived_virtual_data"),
    State('table-icd_procedures', "derived_virtual_selected_rows"),
    State('table-icd_diagnoses', "derived_virtual_data"),
    State('table-icd_diagnoses', "derived_virtual_selected_rows"),



    prevent_initial_call=True
    ) 
def apply_filter(n_clicks, sel_lab, sel_age, sel_sex, sel_icustay, sel_adm_types, sel_adm_locs, sel_dis_locs, df_filtered, lab_table,\
    tbl_drgcodes, tbl_drgcodes_rows,\
        tbl_icd_procedures, tbl_icd_procedures_rows,\
            tbl_icd_diagnoses, tbl_icd_diagnoses_rows,):
    print('applying filters *******************************************')

    df_drgcodes_filterd = pd.DataFrame.from_dict(tbl_drgcodes)
    df_drgcodes_filterd = df_drgcodes_filterd.iloc[tbl_drgcodes_rows]

    df_diagnoses_icd_filterd = pd.DataFrame.from_dict(tbl_icd_diagnoses)
    df_diagnoses_icd_filterd = df_diagnoses_icd_filterd.iloc[tbl_icd_diagnoses_rows]
    
    df_procedures_icd_filterd = pd.DataFrame.from_dict(tbl_icd_procedures)
    df_procedures_icd_filterd = df_procedures_icd_filterd.iloc[tbl_icd_procedures_rows]

    print(df_drgcodes_filterd.dtypes)
    
    if n_clicks>0:
        # print(sel_lab, sel_age, sel_sex, sel_icustay, sel_adm_types)
        sel_sex.append(' ')
        # print(sel_icustay)
        # STEP 1: core filters -> hadm_ids
        filters_core = {
            'age':sel_age,
            'gender':sel_sex,
            'icustays':pd.DataFrame.from_dict(sel_icustay),
            'adm_types':sel_adm_types,
            'adm_locs':sel_adm_locs,
            'dis_locs':sel_dis_locs,

        }
        # print(filters)
        q_core = hk_psql.bq_core(filters_core)
        # print(q_core)
        df_filtered_core = hk_psql.query(q_core, conn)
        # print(df_filtered)

        hadm_ids_core = df_filtered_core['hadm_id'].unique().tolist()
        print(len(hadm_ids_core))
        # STEP 2: filter drg codes
        
        filters_codes = {
            'drgcodes' : df_drgcodes_filterd,
            'diagnoses_icd' : df_diagnoses_icd_filterd,
            'procedures_icd' : df_procedures_icd_filterd,

        }
        print(filters_codes)


        # q = hk_psql.bq_drgcodes(filters_codes, hadm_ids_core)
        # df_filtered_drgcodes = hk_psql.query(q, conn)
        # print(q)
        # hadm_ids_temp = df_filtered_drgcodes['hadm_id'].unique().tolist()
        # print(len(hadm_ids_temp))

        # q = hk_psql.bq_diagnoses_icd(filters_codes, hadm_ids_temp)
        # df_filtered_diagnoses_icd = hk_psql.query(q, conn)
        # print(q)
        # hadm_ids_temp = df_filtered_diagnoses_icd['hadm_id'].unique().tolist()
        # print(len(hadm_ids_temp))

        # q = hk_psql.bq_procedures_icd(filters_codes, hadm_ids_temp)
        # df_filtered_procedures_icd = hk_psql.query(q, conn)
        # print(q)
        # hadm_ids_temp = df_filtered_procedures_icd['hadm_id'].unique().tolist()
        # print(len(hadm_ids_temp))

        q = hk_psql.bq_codes(filters_codes, hadm_ids_core)
        # print(q)
        df_filtered_codes = hk_psql.query(q, conn)
        hadm_ids_temp = df_filtered_codes['hadm_id'].unique().tolist()
        print(len(hadm_ids_temp))

        # STEP 3: Hosp filters -> hadm_ids
        filters_hosp = {
            'labevents': pd.DataFrame.from_dict(lab_table),

        }
        
        q_hosp = hk_psql.bq_hosp(hadm_ids_temp, filters_hosp)
        print('hi fdgdgf')
        # print(q_hosp)
        df_filtered_hosp = hk_psql.query(q_hosp, conn)
        df_filtered = pd.merge(df_filtered_hosp, df_filtered_core[['hadm_id','anchor_age','gender','careunit','icu_los']], how='inner',on=['hadm_id'])
        print(df_filtered_core)
        print(df_filtered_hosp)        
        print(df_filtered)

        hadm_ids = df_filtered_hosp['hadm_id'].unique().tolist()
        sub_ids = df_filtered_hosp['subject_id'].unique().tolist()
        print(len(hadm_ids))
        # print(df_filtered2['itemid'].unique().tolist())
        print('print fff2')
        
        df_count=pd.DataFrame({'gender' : df_filtered['gender'].unique(),
                'adm_count' : df_filtered.groupby(['hadm_id'])['gender'].agg(pd.Series.mode).value_counts(),
                'pat_count' : df_filtered.groupby(['subject_id'])['gender'].agg(pd.Series.mode).value_counts(),
        
        })
        df_age = df_filtered.groupby(['subject_id'])['anchor_age'].mean().reset_index()
        df_icu = df_filtered.groupby(['careunit'])['icu_los'].sum().reset_index(name='sum')
        # df_filtered.to_csv(ADD_DATA+'df_filtered.csv')
        # df_icu['sum'] = (df_icu['sum'] / np.timedelta64(1,'D')).astype(int)
        # print(df_icu)
        print('*********************')
        start_time=time.time()
        # print(df_count)
        # print(df_filtered['gender'].value_counts())
        fig_adm = px.pie(df_count, values='adm_count', names='gender', title='')
        fig_pat = px.pie(df_count, values='pat_count', names='gender', title='')
        fig_age = px.histogram(df_age, x="anchor_age")
        # fig_icustay = px.pie(df_icu, values='sum', names='careunit', title='')
        fig_icustay = fig_age
        print("--- %s seconds ---" % (time.time() - start_time))


        bio_container_children=[];
        for i in df_filtered['itemid'].unique():
            new_df = df_filtered[df_filtered['itemid']==i]
            print(i)
            print(type(i))

            new_child=html.Div(
            style={'width': '45%', 'display': 'inline-block', 'outline': 'thin lightgrey solid', 'padding': 10},
            
            children=[
                dcc.Graph(
                    id={
                        'type': 'dynamic-graph',
                        'index': str(i)
                    },
                    figure=px.histogram(new_df, x="valuenum", title=d_labitems[d_labitems['itemid']==i]['label'].iloc[0])
                ),

            ])
            bio_container_children.append(new_child)


    msg = f"Filter done in {time.time() - start_time}.2f seconds"
    txt_adm = f"{len(hadm_ids)} admissions found!" 
    txt_pat = f"{len(sub_ids)} patients found!" 
    return fig_adm, fig_pat, fig_age, fig_icustay, df_filtered['itemid'].unique().tolist(),\
     df_filtered.to_dict(), bio_container_children, hadm_ids, True, txt_adm, txt_pat #df_filtered.to_dict('records')

@app.callback(
    Output('adding-labs-table', 'data'),
    Input('add-lab-button', 'n_clicks'),
    State('adding-labs-table', 'data'),
    State('adding-labs-table', 'columns'),
    State('d_labitems-drop', 'value'),
    prevent_initial_call=True

    )

def add_row_lab(n_clicks, rows, columns, new_item):
    info = d_labitems[d_labitems['label']==new_item]
    print(info)
    # print(info['category'])
    # print(str(info['category']))

    if n_clicks > 0:
        rows.append({'id_item': info['itemid'].iloc[0],'id_label': info['label'].iloc[0], 'id_fluid':info['fluid'].iloc[0], 'id_cat':info['category'].iloc[0],
         'id_range':f"{info['ref_range_lower'].iloc[0]}-{info['ref_range_upper'].iloc[0]}" , 'id_unit':info['valueuom'].iloc[0],
        #   'id_condition':info['valueuom'], 'id_counts':info['valueuom']
        })
    return rows


@app.callback(
    Output('adding-careunit-table', 'data'),
    Input('add-careunit-button', 'n_clicks'),
    State('adding-careunit-table', 'data'),
    State('adding-careunit-table', 'columns'),
    State('careunit-drop', 'value'),
    prevent_initial_call=True

    )

def add_row_careunit(n_clicks, rows, columns, new_item):
    if n_clicks > 0:
        print(new_item)
        rows.append({'id_careunit': new_item, 'id_los_min': '5', 'id_los_max': '24' })
    return rows

@app.callback(
    Output('result-info', 'children'),
    Input('button-save', 'n_clicks'),
    State('memory-hadm_ids', 'data'),
    State('cohort-name', 'value'),
    prevent_initial_call=True

    )

def save_cohort(n_clicks, hadm_ids, cohort_name):
    if n_clicks > 0:

        print(len(hadm_ids))
        print(cohort_name)
        hk_psql.save_cohort(hadm_ids, cohort_name)

    return str(len(hadm_ids))

