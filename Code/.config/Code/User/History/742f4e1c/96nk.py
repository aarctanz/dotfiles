import random
import numpy as np
import matplotlib.pyplot as plt
# ls = [1,2,3,4,5,6]
# out = []

# for _ in range(1000000):
#     out.append(random.choice(ls))

# for i in ls:
#     print(i, out.count(i)/len(out))


ls = np.random.random(100000)

bins = np.linspace(0,1,11)
counts, bin_edges = np.histogram(ls, bins=bins)
print(counts, bin_edges)

plt.hist(ls,bins=bins, edgecolor="block")
plt.xlabel('Bins')
plt.ylabel('Frequency')
plt.title('Histogram of 10,000 Random Numbers')
plt.show()