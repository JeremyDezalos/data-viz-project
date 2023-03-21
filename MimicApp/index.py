from dash import Dash,dash_table, dcc, html, Input, Output, State, MATCH, ALL  # pip install dash (version 2.0.0 or higher)
import dash_bootstrap_components as dbc
from dash.exceptions import PreventUpdate

# Connect to main app.py file
from app import app
from app import server
 
# Connect to your app pages
from apps import cohort_vis, cohort_sel
# from apps import cohort_select#, module_cohort

app.layout = html.Div([
    dcc.Location(id='url', refresh=False, pathname='/'),
    dbc.Row([
        dbc.Col([
            dbc.Nav([
                dbc.NavItem(dbc.NavLink("Select a cohort |", active=False, href="/apps/cohort_sel")),
                dbc.NavItem(dbc.NavLink("Visualize a cohort", href="/apps/cohort_vis")),
                    
                
            ]),
            html.Br(),
            html.H1("MIMIC IV App", style={'text-align': 'left'}),    
            # dcc.Link('Select a cohort|', href='/apps/cohort_sel'),
            # dcc.Link('Visualize a cohort', href='/apps/cohort_vis'),

        ], width=6),

        dbc.Col([
            html.Div([
                        html.Img(src="/assets/epfl_logo.png", height='80px'),
                    ],className='logo-epfl',style={'width': '45%', 'display': 'inline-block', 'outline': 'thin lightgrey solid', 'padding': 10},),

                    html.Div([
                        html.Img(src="/assets/digi_logo.png", height='80px'),
                    ],className='logo-digi', style={'width': '45%', 'display': 'inline-block', 'outline': 'thin lightgrey solid', 'padding': 10},),

        ], width=6),
    ]),
    html.Div(id='page-content', children=[])
])


@app.callback(Output('page-content', 'children'),
              [Input('url', 'pathname')])
def display_page(pathname):
    if pathname == '/apps/cohort_sel':
        return cohort_sel.layout

    
    if pathname == '/apps/cohort_vis':
        return cohort_vis.layout

    
    else:
        return "404 Page Error! Please choose a link"


if __name__ == '__main__':
    app.run_server(debug=True)


