

# Import libraries
from xml.etree.ElementTree import Comment
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import psycopg2
from sqlalchemy import create_engine
import time

import datetime
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

ADD_DATA = "C:\\DATA\\data\\raw\\mimic4\\lookup\\"
ADD_DATA="C:\\DATA\\data\\processed\\MimicApp\\lookup\\"
ADD_DATA="../resources/data1/lookup/"

DBNAME='datavis'




# ADD_DATA = "/mlodata1/hokarami/tedam/MimicApp/lookup/"

d_labitems = pd.read_csv(ADD_DATA+'d_labitems.csv')
d_icd_diagnoses = pd.read_csv(ADD_DATA+'d_icd_diagnoses.csv')
d_icd_procedures = pd.read_csv(ADD_DATA+'d_icd_procedures.csv')
d_items = pd.read_csv(ADD_DATA+'d_items.csv')
icustays = pd.read_csv(ADD_DATA+'icustays.csv')
digi_bio = pd.read_csv(ADD_DATA+'digi_bio.csv')




def drop_schema(dbs):

    # dbs = ['cabg',]


    schemas = {
        'mimic_core':['transfers', 'admissions','patients'],
        'mimic_hosp':['labevents',
        'diagnoses_icd','procedures_icd','drgcodes',
        'emar',],
        'mimic_icu':['chartevents', 'inputevents', 'procedureevents', 'icustays'],
    }

    for newdb in dbs:
        for schema,tables in schemas.items():
                q=f"""
                DROP SCHEMA IF EXISTS {newdb}_{schema} CASCADE;
                """

                # print(q) 
                cmd(q,DBNAME)


    return

def create_db(dbname):
    if dbname==DBNAME:
        return
    # information used to create a database connection
    sqluser = 'postgres'
    # dbname = DBNAME
    schema_name = 'mimic_core'
    mypass='Hkmypassword1374!'
    conn_string = f"postgresql://{sqluser}:{mypass}@localhost/"

    # #establishing the connection
    # conn = psycopg2.connect(
    # database="postgres", user='postgres', password=mypass, host='127.0.0.1', port= '5432'
    # )
    # # conn.autocommit = True

    # #Creating a cursor object using the cursor() method
    # cursor = conn.cursor()

    # #Preparing query to create a database
    # sql = '''CREATE database myddb''';

    # #Creating a database
    # cursor.execute(sql)
    # print("Database created successfully........")

    # #Closing the connection
    # conn.close()

    conn = psycopg2.connect(conn_string                        )
    conn.autocommit = True

    
    #Creating a cursor object using the cursor() method
    cursor = conn.cursor()

    #Preparing query to create a database
    sql = f'''
                CREATE database {dbname}''';

    #Creating a database
    cursor.execute(sql)
    print(f"Database [{dbname}] created successfully........")

    #Closing the connection
    conn.close()

    return
def connect_psql(dbname, mypass='Hkmypassword1374!'):



    # information used to create a database connection
    sqluser = 'postgres'
    # dbname = DBNAME
    schema_name = 'mimic_core'
    # mypass='Hkmypassword1374!'

    # query_schema = 'set search_path to ' + schema_name + ';'

    query = """
    SELECT *

    FROM mimic_core.patients
    LIMIT 10
    """

    
    conn_string = f"postgresql://{sqluser}:{mypass}@localhost/{dbname}"

    conn = psycopg2.connect(conn_string                        )

   

    db = create_engine(conn_string)
    conn = db.connect()


    # df = pd.read_sql_query(query, conn)
    # print(df.head())
    print('DATABASE CONNECTED !!!')
    return conn

def query(q, conn):
    start_time = time.time()

    if (conn is not None):

        temp = pd.read_sql_query(q, conn)
        print("--- %s seconds ---" % (time.time() - start_time))

        return temp
    else:
        raise("Bad connection")

def cmd(q, dbname):
    start_time = time.time()
    sqluser = 'postgres'
    # dbname = DBNAME
    schema_name = 'mimic_core'
    mypass='Hkmypassword1374!'
    conn_string = f"postgresql://{sqluser}:{mypass}@localhost/{dbname}"
    conn = psycopg2.connect(conn_string                        )

       #establishing the connection
    # conn = psycopg2.connect( database=f"{dbname}", user='postgres', password=mypass, host='localhost')
    # conn.autocommit = True
    with conn:
        with conn.cursor() as cursor:
            cursor.execute(q)
            

    # print(q)
    print("--- %s seconds ---" % (time.time() - start_time))
    conn.close()

    return 
    



def bq_drgcodes(filters, hadm_ids=[]):


    """
    filter is a dicitionary of

    labevents: dataframe {'itemid', 'condition'}
    """

    print("QUERY bq_drgcodes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    f_drgcodes=""


    if len(filters['drgcodes'])>0:
        temp = filters['drgcodes']['drg_code'].tolist()
        f_drgcodes = f"and ( drg.drg_code in ({str(temp)[1:-1]}) )" 
   
    f_hadm=''
    if len(hadm_ids)>0:
        f_hadm = f"and ( drg.hadm_id in ({str(hadm_ids)[1:-1]}) )" 
  
    q = f"""
        SELECT * 
        FROM mimic_hosp.drgcodes drg


        where
            TRUE
            {f_hadm}
            {f_drgcodes}

            


    """

    return q

def bq_diagnoses_icd(filters, hadm_ids=[]):


    """
    filter is a dicitionary of

    labevents: dataframe {'itemid', 'condition'}
    """

    print("QUERY bq_diagnoses_icd >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    f_diagnoses_icd=""


    if len(filters['diagnoses_icd'])>0:
        temp = filters['diagnoses_icd']['icd_code'].tolist()
        f_diagnoses_icd = f"and (icd_code in ({str(temp)[1:-1]}) )" 
   
    f_hadm=''
    if len(hadm_ids)>0:
        f_hadm = f"and (hadm_id in ({str(hadm_ids)[1:-1]}) )" 
  
    q = f"""
        SELECT * 
        FROM mimic_hosp.diagnoses_icd

        where
            TRUE
            {f_hadm}
            {f_diagnoses_icd}

            


    """

    return q

def bq_procedures_icd(filters, hadm_ids=[]):


    """
    filter is a dicitionary of

    labevents: dataframe {'itemid', 'condition'}
    """

    print("QUERY bq_procedures_icd >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    f_procedures_icd=""


    if len(filters['procedures_icd'])>0:
        temp = filters['procedures_icd']['icd_code'].tolist()
        f_procedures_icd = f"and (icd_code in ({str(temp)[1:-1]}) )" 
   
    f_hadm=''
    if len(hadm_ids)>0:
        f_hadm = f"and (hadm_id in ({str(hadm_ids)[1:-1]}) )" 
  
    q = f"""
        SELECT * 
        FROM mimic_hosp.procedures_icd

        where
            TRUE
            {f_hadm}
            {f_procedures_icd}

            


    """

    return q

def bq_codes(filters, hadm_ids=[]):


    """
    filter is a dicitionary of

    labevents: dataframe {'itemid', 'condition'}
    """


    # print( filters['diagnoses_icd'].dtypes)
    # print( filters['procedures_icd'].dtypes)
    print("QUERY CODES 11 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    f_drgcodes=""
    f_diagnoses_icd=""
    f_procedures_icd=""

    if len(filters['drgcodes'])>0:
        # print(filters['drgcodes'])
        temp = filters['drgcodes']['drg_code'].astype(str).tolist()
        # print(temp)
        f_drgcodes = f"and ( drg.drg_code in ({str(temp)[1:-1]}) )" 
        # print(f_drgcodes)

    if len(filters['diagnoses_icd'])>0:
        # print(filters['diagnoses_icd'])
        print('HOOJJAT')
        
        temp = filters['diagnoses_icd']['icd_code'].astype(str).tolist()
        # print(temp)
        f_diagnoses_icd = f"and ( diag.icd_code in ({str(temp)[1:-1]}) )" 
        # print(f_diagnoses_icd)

    if len(filters['procedures_icd'])>0:
        
        # print(filters['procedures_icd'])
        temp = filters['procedures_icd']['icd_code'].astype(str).tolist()
        print(temp)
        f_procedures_icd = f"and ( proc.icd_code in ({str(temp)[1:-1]}) )" 
        # print(f_procedures_icd)
    
    f_hadm=''
    if len(hadm_ids)>0:
        f_hadm = f"and ( drg.hadm_id in ({str(hadm_ids)[1:-1]}) )" 
    

    # print(f_hadm)
    q = f"""
    SELECT 
        drg.hadm_id,
        drg.drg_code,
        diag.icd_code as diag_icd,
        diag.seq_num as diag_seq,
        proc.icd_code as proc_icd,
        proc.seq_num as proc_seq


    FROM mimic_hosp.drgcodes drg

            inner join mimic_hosp.diagnoses_icd diag
            on diag.hadm_id=drg.hadm_id

            inner join mimic_hosp.procedures_icd proc
            on proc.hadm_id=drg.hadm_id

            where
                TRUE

            {f_hadm}
            and ( (TRUE
                {f_drgcodes})
                {f_diagnoses_icd}
                {f_procedures_icd}
            )
            
            


    """
    d=f"""
    where fgsd
                TRUE

            and ( (false
                {f_drgcodes})
                {f_diagnoses_icd}
                {f_procedures_icd}
            )
    """
    print(d)

    

    return q


def bq_core(filters):

    """
    this is a comment

    filter is a dicitionary of

    age: [min, max]
    gender: ['F', 'M', '']

    adm_types: ['item 1', ...]
    adm_locs: ['item 1', ...]
    dis_locs: ['item 1', ...]
    icustay: dataframe {'id_careunit': 'Medical Intensive Care Unit (MICU)', 'id_los': 'X>24'}
    """

    print(filters['icustays'])

    f_age = f"""pat.anchor_age between {filters['age'][0]} and {filters['age'][1]}"""
    f_gender = f"""pat.gender in ({str(filters['gender'])[1:-1]})"""
    f_adm_types=""
    f_adm_locs=""
    f_dis_locs=""
    f_icustays=""
    print('hi')
    # print(str(filters['icustays']['id_careunit'].tolist())[1:-1])

    if filters['adm_types']:
        f_adm_types = f"""and adm.admission_type in ({str(filters['adm_types'])[1:-1]})"""
    if filters['adm_locs']:
        f_adm_locs = f"""and adm.admission_location in ({str(filters['adm_locs'])[1:-1]})"""
    if filters['dis_locs']:
        f_dis_locs = f"""and adm.discharge_location in ({str(filters['dis_locs'])[1:-1]})"""
    if len(filters['icustays'])>0:
        print('hi2')
        print((filters['icustays']))
        for i in range(len(filters['icustays'])):
            # print(filters['icustays']['id_los'].iloc[i])
            # f"""and tra.careunit in ({str(filters['icustays']['id_careunit'].tolist())[1:-1]})"""
           
        
            # by core.transfers
            f_icustays = f_icustays + f"""

            (
                 strpos(tra.careunit,'{filters['icustays']['id_careunit'].iloc[i]}')>0
                and
                (tra.outtime between (tra.intime+ interval '1' HOUR * {filters['icustays']['id_los_min'].iloc[i]} )
                 AND (tra.intime+ interval '1' HOUR * {filters['icustays']['id_los_max'].iloc[i]} )             )
            )
            or"""


            # by icu.icustays

            # f_icustays = f_icustays + f"""

            # (
            #      strpos(icustays.first_careunit,'{filters['icustays']['id_careunit'].iloc[i]}')>0
            #     and
            #     (icustays.los between ({int( filters['icustays']['id_los_min'].iloc[i] ) / 24} )
            #      AND ({int( filters['icustays']['id_los_max'].iloc[i] )/24}  )             )
            # )
            # or"""



        print('hi3')
        f_icustays = f_icustays[:-2]
        f_icustays = 'and('+f_icustays+')'

    print(f_icustays)
    print('done')
    q = f"""
    SELECT  
        adm.subject_id,
        adm.hadm_id,
        icustays.stay_id,
        icustays.first_careunit as icu,
        icustays.los as icu_los,
        
        tra.transfer_id,
        tra.careunit,
        tra.outtime - tra.intime careunit_los,
        pat.anchor_age,
        pat.gender
    FROM 
        mimic_core.admissions adm
    
    inner join 
        mimic_core.patients pat
    on  pat.subject_id=adm.subject_id
    
    inner join 
        mimic_core.transfers tra
    on  tra.hadm_id=adm.hadm_id

    inner join 
        mimic_icu.icustays icustays
    on  icustays.hadm_id=adm.hadm_id


    WHERE 
        {f_age}
        and
        {f_gender}
        
        {f_adm_types}
        {f_adm_locs}
        {f_dis_locs}

        {f_icustays}
    order by 
        adm.hadm_id

    """

    return q





def bq_hosp(hadm_ids, filters):


    """
    filter is a dicitionary of

    labevents: dataframe {'itemid', 'condition'}
    """

    f_labevents_cond = ""
    f_labevents_counts = ""
    if len(filters['labevents'])>0:
        
        filters['labevents']['id_condition'] = filters['labevents']['id_condition'].replace({'X':'lab.valuenum'}, regex=True)

        # defing query for condition on value
        for i in range(len(filters['labevents'])):
            id =filters['labevents']['id_item'].iloc[i]
            if pd.isnull(filters['labevents']['id_condition'].iloc[i]):
                cond='TRUE'
            else:
                cond=filters['labevents']['id_condition'].iloc[i]
            f_labevents_cond = f_labevents_cond + f"""
            (lab.itemid={id} and ({cond}) ) or"""
        f_labevents_cond = f_labevents_cond[:-2]
        f_labevents_cond = 'and('+f_labevents_cond+')'


        # defing query for condition on counts
        for i in range(len(filters['labevents'])):
            id =filters['labevents']['id_item'].iloc[i]
            if pd.isnull(filters['labevents']['id_counts'].iloc[i]):
                cond='TRUE'
            else:
                cond=filters['labevents']['id_counts'].iloc[i]
            f_labevents_counts = f_labevents_counts + f"""
            (itemid={id} and (count(itemid)>{cond}) ) or"""
        f_labevents_counts = f_labevents_counts[:-2]
        f_labevents_counts = 'and ('+f_labevents_counts+')'
    
    
    
    f_hadm=''
    if len(hadm_ids)>0:
        f_hadm = f"and ( hadm_id in ({str(hadm_ids)[1:-1]}) )" 
    

    # print(f_hadm)
    q = f"""
        select hadm_id, itemid, count(itemid) as counts from(

            SELECT * 
            FROM mimic_hosp.labevents as lab

            where
                TRUE
                {f_hadm}
                {f_labevents_cond}
        ) as XXX
        group by hadm_id, itemid
        having 
            TRUE

            {f_labevents_counts}
        order by hadm_id, itemid, counts desc


    """
    # print(q)
    # term
    return q

def df_to_dashTable(df, adm_time=None):

    if adm_time is not None:
        df=data2hour(df, adm_time)
        df = summary_by(df, 'itemid')
        print('fffffffffffffffff')
        print(df.columns)
        # xvxc
    if 'seq_num' in df.columns and len(df.columns)==5:
        df = df.sort_values('seq_num')
        df = pd.merge(df, d_icd_diagnoses[['icd_code', 'icd_version','long_title']] )
        # df['label'] = lookup_itemid(df['icd_code'].tolist(), type='icd_diagnoses')
    elif 'seq_num' in df.columns and len(df.columns)==6:
        df = df.sort_values('seq_num')
        df = pd.merge(df, d_icd_procedures[['icd_code', 'icd_version','long_title']] )

        # df['label'] = lookup_itemid(df['icd_code'].tolist(), type='icd_procedures')
    dict_ = df.to_dict('records')
    cols_ = [{"name": i, "id": i, "deletable": True, "selectable": True} for i in df.columns]
    return dict_, cols_


def save_cohort(newdb, hadm_ids, subject_ids=None):

    # hadm_ids=[20940957, 24181354]
    schemas = {
    # 'mimic_core':['transfers', 'admissions','patients'],
    'mimic_core':['transfers', 'admissions','patients'],

    'mimic_hosp':['labevents',
    'diagnoses_icd','procedures_icd','drgcodes',
    'emar',
    'd_hcpcs','d_icd_diagnoses','d_icd_procedures','d_labitems'],
    'mimic_icu':['chartevents', 'inputevents', 'procedureevents', 'icustays', 'd_items'],
}
# newdb = 'co_1'

    for schema,tables in schemas.items():
        q=f"""
        DROP SCHEMA IF EXISTS {newdb}_{schema} CASCADE;
        CREATE SCHEMA IF NOT EXISTS {newdb}_{schema};
        """
        q=f"""
        CREATE SCHEMA IF NOT EXISTS {newdb}_{schema};
        """
        # print(q) 
        cmd(q,DBNAME)
        for table in tables:
            print(schema, table)
            print(table)
            # copying table


            if table=='emar_detail':
                q=f"""
                    create table if not exists {newdb}_{schema}.{table}  AS
                    select emar_detail.emar_id, emar_detail.emar_seq, emar_detail.parent_field_ordinal, emar_detail.administration_type, emar_detail.pharmacy_id, emar_detail.barcode_type, emar_detail.reason_for_no_barcode, emar_detail.complete_dose_not_given, emar_detail.dose_due, emar_detail.dose_due_unit, emar_detail.dose_given, emar_detail.dose_given_unit, emar_detail.will_remainder_of_dose_be_given, emar_detail.product_amount_given, emar_detail.product_unit, emar_detail.product_code, emar_detail.product_description, emar_detail.product_description_other, emar_detail.prior_infusion_rate, emar_detail.infusion_rate, emar_detail.infusion_rate_adjustment, emar_detail.infusion_rate_adjustment_amount, emar_detail.infusion_rate_unit, emar_detail.route, emar_detail.infusion_complete, emar_detail.completion_interval, emar_detail.new_iv_bag_hung, emar_detail.continued_infusion_in_other_location, emar_detail.restart_interval, emar_detail.side, emar_detail.site, emar_detail.non_formulary_visual_verification
                    from {schema}.{table} emar_detail
                    inner join {newdb}_{schema}.emar emar
                    on emar.emar_id=emar_detail.emar_id

                    where hadm_id in ({str(hadm_ids)[1:-1]})
                    
                    
                    """
            elif table=='patients':
                q=f"""
                    create table if not exists {newdb}_{schema}.{table}  AS
                    select *
                    from {schema}.{table} 

                    
                    
                    
                    """ # where subject_id in ({str(subject_ids)[1:-1]})

            elif table in ['d_hcpcs','d_icd_diagnoses','d_icd_procedures','d_labitems',  'd_items']:
                q=f"""
                create table if not exists {newdb}_{schema}.{table}  AS
                select * 
                from {schema}.{table}

                """
            else:
                q=f"""
                create table if not exists {newdb}_{schema}.{table}  AS
                select * 
                from {schema}.{table}
                where 
                    hadm_id in ({str(hadm_ids)[1:-1]})
                """
                # print(q)
            
            
            cmd(q,DBNAME)


    return

def summary(schema_core, conn):
    q=f"""
    
    select 
        adm.hadm_id,
        adm.dischtime-adm.admittime as hosp_los

    from {schema_core}.admissions as adm    
    
    """
    df = query(q, conn)

    df['hosp_los'] = round(df['hosp_los'] / np.timedelta64(1, 'h'), 1)

    return df

def load_hadm(conn, cohort, hadm_id):


    schemas = {
        'mimic_core':['transfers', 'admissions',],
        'mimic_hosp':['labevents',
        'diagnoses_icd','procedures_icd','drgcodes',
        'emar',],
        'mimic_icu':['chartevents', 'inputevents', 'procedureevents', 'icustays'],
    }
    dict_hadm = {}

    for schema,tables in schemas.items():
        dict_hadm[schema] = {}
        for table in tables:
            dict_hadm[schema][table]=pd.DataFrame()
            print(schema, table)
            q=f"""
            select *
            from {cohort}_{schema}.{table}
            where hadm_id={hadm_id}
            """
            # print(q)
            dict_hadm[schema][table] = query(q, conn)

    

    return dict_hadm

def summary_by(df, col):
    df_count = df.groupby([col])['hadm_id'] \
                .count() \
                .reset_index(name='count') \
                .sort_values(['count'], ascending=False)

    print("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
    print(df_count)

    df_summary = df.drop_duplicates(col)
    temp= lookup_itemid(df_summary[col].tolist())
    print(temp)
    print(len(temp))
    print(len(df_summary))
    df_summary['label']  = temp
    print(df_summary)

    # print(df_label)
    # print(df_le)
    # print(df_count)

    df_summary = pd.merge(df_summary, df_count, how="inner", on=[col])

    cols = list(df_summary.columns.values) #Make a list of all of the columns in the df
    cols.pop(cols.index(col)) #Remove b from list
    cols.pop(cols.index('label')) #Remove b from list
    cols.pop(cols.index('count')) #Remove b from list
    df_summary = df_summary[[col,'label','count'] + cols] #Create new dataframe with columns in the order you want

    df_summary = df_summary.sort_values('count', ascending=False)
    # print(df_summary)
    
    # df_hosp_summary=temp2[['itemid','label','valueuom_y','count', 'fluid', 'category']].sort_values(['count'], ascending=False)
    
    return df_summary

def icu_summary(dict_hadm, d_items):
    print('salam')
    df_chart = dict_hadm['mimic_icu']['chartevents']
    df_count = df_chart.groupby(['itemid'])['hadm_id'] \
            .count() \
            .reset_index(name='count') \
            .sort_values(['count'], ascending=False)

    df_chart = df_chart.drop_duplicates('itemid')
    
    filter1=(d_items['linksto']=='chartevents') & (d_items['param_type']=='Numeric')
    df_label = d_items[filter1].drop_duplicates('itemid')
    # print(df_label)
    # print(df_chart)
    # print(df_count)

    temp1 = pd.merge(df_chart, df_count, how="inner", on=['itemid'])
    temp2 = pd.merge(temp1, df_label, how="inner", on=['itemid'])
    # print(temp2)
    # print(temp2.columns)
    
    df_icu_summary=temp2[['itemid','label','count', 'category']].sort_values(['count'], ascending=False)
    

    return df_icu_summary


def hosp_summary(dict_hadm, d_labitems):
    print('salam hosp summary')
    df_le = dict_hadm['mimic_hosp']['labevents']
    df_count = df_le.groupby(['itemid'])['hadm_id'] \
            .count() \
            .reset_index(name='count') \
            .sort_values(['count'], ascending=False)

    df_le = df_le.drop_duplicates('itemid')
    df_label = d_labitems.drop_duplicates('itemid')
    # print(df_label)
    # print(df_le)
    # print(df_count)

    temp1 = pd.merge(df_le, df_count, how="inner", on=['itemid'])
    temp2 = pd.merge(temp1, df_label, how="inner", on=['itemid'])
    # print(temp1)
    # print(temp2.columns)
    
    df_hosp_summary=temp2[['itemid','label','valueuom_y','count', 'fluid', 'category']].sort_values(['count'], ascending=False)
    

    return df_hosp_summary

def plot_timeline(df, x_start="x_start", x_end="x_end", y='y', color='color',hover_data=[]):
    # https://stackoverflow.com/questions/66078893/plotly-express-timeline-for-gantt-chart-with-integer-xaxis
    df['delta'] = df[x_end] - df[x_start]
    # print(df)
    # print('timeline')
    # fig = px.timeline(df, x_start="Start", x_end="Finish", y="Task")
    fig = px.timeline(df, x_start=x_start, x_end=x_end, y=y, color=color, hover_data=hover_data)

    # fig.update_yaxes(autorange="reversed") 

    fig.layout.xaxis.type = 'linear'
    # fig.data[0].x = df.delta.tolist()
    # f = fig.full_figure_for_development(warn=False)


    for d in fig.data:
        filt = df[color] == d.name
        d.x = df[filt]['delta'].tolist()

    return fig
   

def tra_summary(df_tra):

    print('tra summary')
    df_tra = df_tra.sort_values('intime')
    df_tra['dummy']=1
    df_tra = df_tra.dropna(subset=['careunit'])
    print(df_tra)

    # fig = px.timeline(df_tra, x_start="intime", x_end="outtime", y='dummy', color='careunit')
    # fig.update_layout(legend=dict(
    #     yanchor="bottom",
    #     y=0.99,
    #     xanchor="left",
    #     x=0.01
    # ))





    adm_time = df_tra['intime'].iloc[0]
    df_tra['intime'] = round((df_tra['intime'] - adm_time) / np.timedelta64(1,'h'),1)
    df_tra['outtime'] = round((df_tra['outtime'] - adm_time) / np.timedelta64(1,'h'),1)

    df_tra['stay (hours)'] = round((df_tra['outtime'] - df_tra['intime']),1)
    df_tra['delta'] = df_tra['outtime'] - df_tra['intime']

    fig = plot_timeline(df_tra, x_start="intime", x_end="outtime", y='dummy', color='careunit')


    # print(df_tra.columns)
    # print(df_tra)
    df_tra_summary=df_tra[['eventtype', 'careunit','intime', 'outtime', 'stay (hours)']]
    # fig = px.timeline(df_tra, x_start="intime", x_end="outtime", y="careunit")
    
    # fig = px.timeline(df_tra, x_start="intime", x_end="outtime", y='dummy', color='careunit')
    # fig.update_layout(legend=dict(
    #     yanchor="bottom",
    #     y=0.99,
    #     xanchor="left",
    #     x=0.01
    # ))
    return df_tra_summary, fig



def scatterplot(data_left, data_right, df_events, h1, h2):

    """
    data is a dict of 'x','y','label' which are lists
    
    """
    fig = make_subplots(
        specs=[[{"secondary_y": True}], [{"secondary_y": False}]],
        rows=2, cols=1,
        row_heights =[h1/(h1+h2), h2/(h1+h2)],
        shared_xaxes=True,
        vertical_spacing=0.02,
    )

    print('my scatter plot')

    for i in range(len(data_left['x'])):
        xnew = data_left['x'][i]
        ynew = data_left['y'][i]
        label_new = data_left['label'][i]

        # rescale the data from 2,3,...
        if i>0:
            np_ynew=np.array(ynew)
            np_y1=np.array(data_left['y'][0])
            print('heiiii')
            print(np_ynew - np_ynew.min())
            print(np_ynew.max()-np_ynew.min())
            print(np_ynew - min(np_y1))
            print((np_ynew-1)/2)
            np_ynew = (np_ynew - np_ynew.min())/(np_ynew.max()-np_ynew.min()+ np.finfo(float).eps)*(np_y1.max()-np_y1.min())+np_y1.min()
            print(np_ynew)
            ynew = np_ynew.tolist()
        fig.add_trace(
            go.Scatter(x=xnew, y=ynew, name=f'{label_new}', mode='lines+markers',),
            secondary_y=False,
            row=1, col=1)
        # if data_left['normal_range']:
        #     val_low = data_left['normal_range'][0]
        #     val_up = data_left['normal_range'][1]
        #     fig.add_hrect(y0=val_low, y1=val_up, line_width=0, fillcolor="blue", opacity=0.2,row=1, col=1)

    for i in range(len(data_right['x'])):
        xnew = data_right['x'][i]
        ynew = data_right['y'][i]
        label_new = data_right['label'][i]

        # rescale the data from 2,3,...
        if i>0:
            np_ynew=np.array(ynew)
            np_y1=np.array(data_right['y'][0])
            print('heiiii')
            print(np_ynew - np_ynew.min())
            print(np_ynew.max()-np_ynew.min())
            print(np_ynew - min(np_y1))
            print((np_ynew-1)/2)
            np_ynew = (np_ynew - np_ynew.min())/(np_ynew.max()-np_ynew.min()+ np.finfo(float).eps)*(np_y1.max()-np_y1.min())+np_y1.min()
            print(np_ynew)
            ynew = np_ynew.tolist()
        
        fig.add_trace(
            go.Scatter(x=xnew, y=ynew, name=f'{label_new}', mode='lines+markers',),
            secondary_y=True,
            row=1, col=1)
        # if data_right['normal_range']:
        #     val_low = data_right['normal_range'][0]
        #     val_up = data_right['normal_range'][1]
        #     fig.add_hrect(y0=val_low, y1=val_up, line_width=0, fillcolor="red", opacity=0.2,row=1, col=1)


    


    temp = plot_timeline(df_events)


    # temp.update_layout(xaxis_type='linear')
    # temp.update_xaxes(
    #     tickformat="%H\n%M",
    #     tickformatstops=[
    #         dict(dtickrange=[3600000, 86400000], value="%H:%M")]  # range is 1 hour to 24 hours
    # )
    # temp.data[0].x = df.delta.tolist()
    for jj in range(len(temp['data'])):
    
    # temp = go.Scatter(x=xnew, y=ynew, name=f'{label_new}')
        fig.add_trace(
        temp['data'][jj],
                # secondary_y=False,
                row=2, col=1)
    fig.update_layout(legend=dict(
        yanchor="bottom",
        y=0.99,
        xanchor="left",
        x=0.01
    ))

    

    return fig

def data2hour(df, zero=None):
    print('date2hour')
    l=df.dtypes
    for index, value in df.dtypes.items():
        if value=='datetime64[ns]':
            if zero is not None:
                df[index] = round((df[index]-zero) / np.timedelta64(1,'h'),2)
            else:
                df[index] = round((df[index]) / np.timedelta64(1,'h'),2)
    # print(l)
    # print(type(l))
    # print(df)
    
    if 'charttime' in df:
        df = df.sort_values('charttime')
    elif 'starttime' in df:
        df = df.sort_values('starttime')
    elif 'intime' in df:
        df = df.sort_values('intime')
    else:
        print("FUCKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
    
    
    # if zero is not None:
    #     df['charttime'] = round((df['charttime']-zero) / np.timedelta64(1,'h'))

   

    return df


def lookup_itemid(itemids, type=None):

    """
    input: a list if itemids
    output: a list of corresponding label
    """
    if isinstance(itemids, int):
        itemids=[itemids]
    labels=[]
    for itemid in itemids:
        # print(itemid)
        if len(str(itemid))==5  and type is None: # in labevents
            lbl = d_labitems[d_labitems['itemid']==itemid]['label'].iloc[0]
            
                
        if len(str(itemid))==6 and type is None: # in chartevents
            lbl = d_items[d_items['itemid']==itemid]['label'].iloc[0]
        
        if type=='icd_diagnoses':
            lbl = d_icd_diagnoses[d_icd_diagnoses['icd_code']==itemid]['long_title'].iloc[0]
        if type=='icd_procedures':
            lbl = d_icd_procedures[d_icd_procedures['icd_code']==itemid]['long_title'].iloc[0]
        # print(type)
        # print(lbl)
        labels.append(lbl)
    if len(labels)==1:
        return labels[0]
    return labels

def read_from_itemid(dict_hadm, itemids):

    data = {'x':[], 'y':[], 'label':[], 'normal_range':[]}    


    df_lab = dict_hadm['mimic_hosp']['labevents']
    df_chart = dict_hadm['mimic_icu']['chartevents']

    # print(itemids)
    # print("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
    adm_time = dict_hadm['mimic_core']['admissions']['admittime'].iloc[0]

    df_lab = data2hour(df_lab, adm_time)
    df_lchart = data2hour(df_chart, adm_time)

    dis_time = dict_hadm['mimic_core']['admissions']['dischtime'].iloc[0]
    hosp_los = (dis_time - adm_time) / np.timedelta64(1,'h')
    
    
    # print(adm_time)


    
    # data['normal_range'] = temp
    for i, itemid in enumerate(itemids):
        # print(itemid)
        if len(str(itemid))==5: # in labevents
            df_temp = df_lab[df_lab['itemid']==itemid]
            # print(df_temp)
            temp = d_labitems[d_labitems['itemid']==itemid].iloc[0]
            data['normal_range'] = [ df_temp['ref_range_lower'].iloc[0], df_temp['ref_range_upper'].iloc[0] ]
            # print(temp)
            
            
        if len(str(itemid))==6: # in chartevents
            df_temp = df_lchart[df_lchart['itemid']==itemid]

        xnew = df_temp['charttime'].tolist()
        # ynew=[int(i) for i in df_temp['valuenum'].tolist()]
        ynew=df_temp['valuenum'].tolist()
        # print(lookup_itemid(itemid))
        labelnew=f"{lookup_itemid(itemid)}"
        # print(labelnew)

        data['x'].append(xnew)
        data['y'].append(ynew)
        data['label'].append(labelnew)

    return data


def cut(le, tr):
    # assigning each measurement to a transfer_id
    hadm_ids = tr['hadm_id'].unique().tolist()
    # print(hadm_ids[-1])
    for hadm_id in hadm_ids:
        # print(hadm_id)
        # hadm_id = 23471589
        le_temp = le[le['hadm_id']==hadm_id]
        tr_temp = tr[tr['hadm_id']==hadm_id]

        if len(le_temp)==0:
            continue
        # print(tr_temp)
        bins = tr_temp[['intime', 'transfer_id']].copy().reset_index()
        # print(bins)
        bins.loc[len(bins),'intime'] = tr_temp['outtime'].iloc[-1]
        bins = bins.drop_duplicates(subset=['intime'])
        # print( bins['intime'])

        # print(len(bins['transfer_id'].iloc[:-1]) - len(bins['intime']))
        # print(le_temp['charttime'])
        # print(bins['careunit'].iloc[:-1])
        
        le.loc[le['hadm_id']==hadm_id,['transfer_id'] ] = pd.cut(le_temp['charttime'], bins['intime'], labels=bins['transfer_id'].iloc[:-1], ordered=False, duplicates='drop')
        # print(le_temp)
        # le.loc[le['hadm_id']==hadm_id,['careunit'] ] = le_temp ['careunit']
        # dfs
    # print(le.dtypes)
    # print(tr[['transfer_id', 'careunit']].dtypes)
    le = pd.merge(le,tr[['transfer_id', 'careunit']])
    le = le.sort_values(['itemid','hadm_id','charttime'])
    return le







def get_schemas(dbname):

    """
    Create and return a list of dictionaries with the
    schemas and names of tables in the database
    connected to by the connection argument.
    """
    sqluser = 'postgres'
    # dbname = DBNAME
    schema_name = 'mimic_core'
    mypass='Hkmypassword1374!'
    conn_string = f"postgresql://{sqluser}:{mypass}@localhost/{dbname}"
    conn = psycopg2.connect(conn_string                        )
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cursor.execute("""SELECT table_schema, table_name
                      FROM information_schema.tables
                      WHERE table_schema != 'pg_catalog'
                      AND table_schema != 'information_schema'
                      AND table_type='BASE TABLE'
                      ORDER BY table_schema, table_name""")

    tables = cursor.fetchall()
    list_schema=[]
    for row in tables:

        print("{}.{}".format(row["table_schema"], row["table_name"]))
        list_schema.append(row["table_schema"])

    cursor.close()

    return list(set(list_schema))







def create_lookups():
    # this code connects to mimic4 and save important lookup tables
    conn = connect_psql(DBNAME)

    dict_queries = {

        # 'd_labitems':
        # """
        #     SELECT distinct (e.itemid), d.label, e.valueuom, e.ref_range_lower, e.ref_range_upper, d.fluid, d.category
        #     FROM mimic_hosp.labevents as e

        #     inner join mimic_hosp.d_labitems as d
        #         on e.itemid = d.itemid
        #     group by e.itemid, e.valueuom, e.ref_range_lower, e.ref_range_upper, d.label, d.fluid, d.category
        #     order by d.label
        # """,

        'd_icd_procedures':
        """
            SELECT 
                t1.icd_code,t1.icd_version,
                min(t2.long_title) as long_title,
                count(*) as count
            FROM
                mimic_hosp.procedures_icd t1
            inner join mimic_hosp.d_icd_procedures t2
            on t2.icd_code = t1.icd_code and t2.icd_version = t1.icd_version

            group by t1.icd_code, t1.icd_version

            having count(*)>0

            order by count desc
        """,


        'd_icd_diagnoses':
        """
            SELECT 
                t1.icd_code,t1.icd_version,
                min(t2.long_title) as long_title,
                count(*) as count
            FROM
                mimic_hosp.diagnoses_icd t1
            inner join mimic_hosp.d_icd_diagnoses t2
            on t2.icd_code = t1.icd_code and t2.icd_version = t1.icd_version

            group by t1.icd_code, t1.icd_version

            having count(*)>0

            order by count desc
        """,

        
        'd_drgcodes':
        """
            SELECT  distinct (t1.drg_code), count(t1.hadm_id) as count, MIN(t1.drg_type) as drg_type, MIN(description) as description 
            FROM mimic_hosp.drgcodes t1

            group by t1.drg_code

            order by count desc
        """,

        

        'd_items':
        """
            SELECT
                * 
            FROM
                mimic_icu.d_items
        """,


        'icustays':
        """
            SELECT
                * 
            FROM
                mimic_icu.icustays
        """,


        'adm_types':
        """
            SELECT
                distinct(admission_type)
            FROM
                mimic_core.admissions
        """,


        'adm_locs':
        """
            SELECT
                distinct(admission_location)
            FROM
                mimic_core.admissions
        """,


        'dis_loc':
        """
            SELECT
                distinct(discharge_location)
            FROM
                mimic_core.admissions
        """,



    }

    for name, q in dict_queries.items():
        print(name)

        df = query(q, conn)
        print(df.dtypes)
        

        df.to_csv(ADD_DATA+name+'.csv', index=False)

