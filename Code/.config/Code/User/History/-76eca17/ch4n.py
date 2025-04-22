n = int(input())

res = []

def gen(prev):
    if len(prev)==n:
        res.append(prev)
        return
    gen(prev+"0")
    gen(prev+"1")

gen("")
print(res)
def pow2(num):
    return ((num == 1) or not(num & (num - 1)))

for i in range(len(res)-1):
    if(not(pow2(int(res[i],2)^int(res[i+1],2)))):
        for j in range(i+2, len(res)):
           if(pow2(int(res[i],2)^int(res[j],2))):
               temp = res[j]
               res[j] = res[i+1]
               res[i+1] = res[j] 

print(res)