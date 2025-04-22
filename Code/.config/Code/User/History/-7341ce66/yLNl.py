from matplotlib import pyplot as plt
import numpy as np
year = [ 2010 ,2011 ,2012 ,2013 , 2014, 2015,2016,2017, 2018 ,    ]

filed = [4281327,5208653, 6400783, 7555617, 8874616, 10475876,11349260, 13065513, 13724299 ]
disposed = [635001, 1497657, 2997430, 4615820, 6491408, 8082599, 9045730, 11202595, 12255352]
pending = [f - d for f, d in zip(filed, disposed)]

# Bar width and position
bar_width = 0.25
x = np.arange(len(year))

# Plot
plt.figure(figsize=(12, 6))
plt.bar(x - bar_width, filed, width=bar_width, label='Filed', color='skyblue')
plt.bar(x, disposed, width=bar_width, label='Disposed', color='lightgreen')
plt.bar(x + bar_width, pending, width=bar_width, label='Pending', color='salmon')

# Axis stuff
plt.xlabel('Year')
plt.ylabel('Number of Cases')
plt.title('Case Status by Year')
plt.xticks(x, year)
plt.legend()
plt.tight_layout()

# Show
plt.show()