# data-viz-project

# Installing Python packages

Create a new conda environment named `datavis1`:
```
conda update -n base conda
conda env create -f ./base.yaml
conda activate datavis1
```

# Installing MIMIC-APP

* install psql and pgAdmin(the interface)
* create a new database `<database-name>=datavis` with a password `<database-password>` in pgAdmin ().
* create these 3 empty schemas: `cohort1_mimic_core`|`cohort1_mimic_hosp`|`cohort1_mimic_icu`
* Download backup files from [this link](https://drive.switch.ch/index.php/s/PZjZcXRxBeiw1fC)
* Update created schemas by restoring from downloaded backup files ([instructions](https://hevodata.com/learn/pgadmin-backup-database/)).
* Add `lookup` folder ([link](https://drive.switch.ch/index.php/s/iK64Uyq04FabWHA)) to `resources/data1/lookup`

Now, everything is all setup! To run the MimicApp:

```
conda activate datavis1

cd MimicApp
python index.py --dbname <database-name> --psql_pass <database-password>
```

You should be able to see the forwarded port from [http://127.0.0.1:8050](http://127.0.0.1:8050). Select `Visualize a cohort` from top. select 'cohort1' from the dropdown menu and select `load`. DONE!

* you can use `MimicApp/psql2csv.ipynb` to convert database to csv files which will be saved in `MimicApp/datasets/<cohort-name>` (you should modify the absolute PATH in the notebook)

# M1: Data Exploration (April 12)




# Questions

* What questions do you want to answer?
* What is the problem you are trying to solve?
* What decisions are you trying to make?
* What outcomes are you hoping for?
* What story do you want to tell?
* What tasks should the viewer be able to perform?