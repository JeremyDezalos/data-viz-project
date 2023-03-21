import dash
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
import plotly.graph_objs as go
import plotly.express as px  # (version 4.7.0 or higher)

from dash.dependencies import Input,Output
ADD_DATA = "C:\\DATA\\data\\raw\\mimic4\\lookup\\"
# import custom libraries
import sys
sys.path.append("C:\\DATA\\Tasks\\lib\\hk")
import hk_psql

df1_le= pd.read_csv(ADD_DATA+'df1_le.csv')
df1_transfers = pd.read_csv(ADD_DATA+'df1_transfers.csv')

# import python library
import pandas as pd
# assign a variable that contains a string of your credentials
credentials = "postgresql://postgres:Hkmypassword1374!@localhost/mimic"
# read in your SQL query results using pandas
dataframe = pd.read_sql("""
            SELECT *
            FROM mimic_hosp.diagnoses_icd
            
            
            """, con = credentials)
# return your first five rows
print(dataframe.head())
