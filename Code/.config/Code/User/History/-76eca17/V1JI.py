n = int(input())

res = []

def gen(prev):
    if len(prev)==n:
        res.append(prev)
        return
    gen(prev+"0")
    gen(prev+"1")

gen("")
for i in range(len(res)-1):
    if(int(res[i],2)^int(res[i+1],2)):
        