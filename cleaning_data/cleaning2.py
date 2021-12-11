import csv
import pandas as pd
from nltk.corpus import stopwords
from textblob import TextBlob
from textblob import Word

data = pd.read_csv('../metacritic_all_games_with_ign_reviews_corrected.csv')

#put everything in lower case
data['ign_review'] = data['ign_review'].apply(lambda x: " ".join(x.lower() for x in x.split()))

#removing punctuation
data['ign_review'] = data['ign_review'].str.replace('[^\w\s]','')

#removing stop word
stop = stopwords.words('english')
data['ign_review'] = data['ign_review'].apply(lambda x: " ".join(x for x in x.split() if x not in stop))

#removing most common word
mostfreq = pd.Series(' '.join(data['ign_review']).split()).value_counts()[:10]
#print(mostfreq)
data['ign_review'] = data['ign_review'].apply(lambda x: " ".join(x for x in x.split() if x not in mostfreq))

#removing less common word
lessfreq = pd.Series(' '.join(data['ign_review']).split()).value_counts()[-1000:]
#print(lessfreq)
data['ign_review'] = data['ign_review'].apply(lambda x: " ".join(x for x in x.split() if x not in lessfreq))

#spelling correction - take time
data['ign_review'][:5].apply(lambda x: str(TextBlob(x).correct()))

#Lemmatization - TAKE SO MUCH TIME (around 25 minutes i think)
print("debut lemmatization")
data['ign_review'] = data['ign_review'].apply(lambda x: " ".join([Word(word).lemmatize() for word in x.split()]))

#Tokenization
print("debut tokenization")

#methode 1
i=0
while i<len(data['ign_review']):
    TextBlob(data['ign_review'][i]).words #if you want to use the data with token you need this line !
    #print(TextBlob(data['ign_review'][i]).words)

print(TextBlob(data['ign_review'][1]).words)

#methode 2
# critics_clean=[]
# j=0
# while j<len(data['ign_review']):
#     critics_clean.append([i.split(" ") for i in data['ign_review'][i]])

# print(critics_clean[1])

