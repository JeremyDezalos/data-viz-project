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


## Milestone 1 (23rd April, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)), you could use also the DataSets proposed by the ENAC (see the Announcements section on Zulip).

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

### Related work


> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.





