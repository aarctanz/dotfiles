n = int(input())

indexes = [(x,y) for x in range(n) for y in range(n)]
# print(indexes)

d1 = {}
for j in range(n*n):
    d = {}
    for i in range(n*n):
        d[indexes[i]] = 1
    d1[j+1] = d
# print(d1)
# print(d)

attacks = [(1,2), (2,1), (1,-2), (-2,1), (-1, -2), (-2,-1),(-1, 2), (2,-1)]

def getUnsafe(index,j):
    # unsafe = []
    global d1
    for i in attacks:
        x = index[0] + i[0]
        y = index[1] + i[1]

        if x<0 or y<0 or x>=n or y>=n:
            continue
        d1[j][(x,y)] = 0
    d1[j][index] = 0
    # print(d)



# def reset():
#     global d1
#     for key,values in d1.items():
#         d1[key][]
# getUnsafe((0,0))
# unsafeCounts = [0] * n
# safeCounts = [0] * n
safe = 0
for i,index in enumerate(indexes):
    # print(index)
    getUnsafe(index,i+1)

    # safe += sum(d.values())
    # safe += sum(list(d.values())[(i+1)*(i+1):])
    
    # reset()


safe = 0
# for i in range(1, n+1):
    # safe = 0
for j in range((n+1)**2):
    safe += sum(d1[j+1].values())
print(safe>>1)





        
#         # safeCounts[k] += 
#     # for i in unsafe:
#     #     block = max(i)
#     #     print(block, i)
#     #     for k in range(block, n):
#     #         unsafeCounts[k] += 1

# print(unsafeCounts)
# # safeCounts = []
# # for i, j in enumerate(unsafeCounts):
#     # safeCounts[i] = (i+1)**2 - unsafe