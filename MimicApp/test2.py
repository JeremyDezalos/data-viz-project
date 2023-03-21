
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

import time
# import custom libraries
import sys
sys.path.append("C:\\DATA\\Tasks\\lib\\hk")
import hk_psql

import plotly.express as px  # (version 4.7.0 or higher)
import plotly.graph_objects as go



conn = hk_psql.connect_psql('mimic')




sel_icustay = pd.DataFrame()




filters_core = {
        'age':[18,91],
        'gender':['M','F'],
        'icustays':pd.DataFrame.from_dict(sel_icustay),
        'adm_types':[],
        'adm_locs':[],
        'dis_locs':[],

    }
# print(filters)
q_core = hk_psql.bq_core(filters_core)
print(q_core)
df_filtered_core = hk_psql.query(q_core, conn)
# print(df_filtered)
s
hadm_ids_core = df_filtered_core['hadm_id'].unique().tolist()
df_filtered_core
print('len after core: ',len(hadm_ids_core))

# **************** STEP 3: Hosp filters -> hadm_ids
filters_hosp = {
    'labevents': pd.DataFrame.from_dict(lab_table),

}
# print (lab_table)

q_hosp = hk_psql.bq_hosp(hadm_ids_core_code, filters_hosp)
print('hi fdgdgf')
# print(q_hosp)
df_filtered_hosp = hk_psql.query(q_hosp, conn)
print(df_filtered_hosp)
df_filtered = pd.merge(df_filtered_hosp, df_filtered_core[['subject_id','hadm_id','anchor_age','gender','careunit','icu_los']], how='inner',on=['hadm_id'])
# print(df_filtered_core)
# print(df_filtered_hosp)        
print(df_filtered)

hadm_ids = df_filtered['hadm_id'].unique().tolist()

sub_ids = df_filtered['subject_id'].unique().tolist()
print('len after hosp: ',len(hadm_ids))





