

# this code connects to mimic4 and save important lookup tables



# Import libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


# import custom libraries
import sys
sys.path.append("C:\\DATA\\Tasks\\lib\\hk")
import hk_psql

ADD_DATA = "C:\\DATA\\data\\raw\\mimic4\\lookup\\"

conn = hk_psql.connect_psql('mimic')

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

for name, query in dict_queries.items():
    print(name)

    df = hk_psql.query(query, conn)
    print(df.dtypes)
    

    df.to_csv(ADD_DATA+name+'.csv', index=False)