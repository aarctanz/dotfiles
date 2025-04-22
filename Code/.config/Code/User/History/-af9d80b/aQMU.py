import numpy as np

marks = np.array([65,81,78,76])
credit = np.array([4,4,6,6])

# print(np.sum(marks*credit)/np.sum(credit))

# print((2/(1/10 + 1/50) + 40)/2)

child = np.array([1,2,3,4,5,6])
fam = np.array([1.5, 1.8, 1, 0.4,0.2,0.1])

# print(np.sum(child*fam)/np.sum(fam))
# print(np.median(child))

def mode(arr):
    counts = np.bincount(arr)
    return np.argmax(counts)

for i in range(11):
    r = [i]
    for j in range(11):
        r.append(j)
        for k in range(11):
            r.append(k)
            for l in range(11):
                for m in range(11):
                    r.append(l)
                    mean = np.mean(r)
                    med = np.median(r)
                    mode = mode(r)

                    if(med<mode and mode<mean):
                        print(r)
                        exit(1)
                    r.pop()
                r.pop()
            r.pop()
        r.pop()