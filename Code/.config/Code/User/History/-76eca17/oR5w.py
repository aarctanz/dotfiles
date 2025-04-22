n = int(input())

res = []

def gen(prev):
    if len(prev)==n:
        res.append(prev)
        return
    gen(prev+"0")
    gen(prev+"1")

gen("")
def pow2(num):
    return not(bool((num == 1) or not(num & (num - 1))))
print(pow2(50), pow2(1))
# for i in range(len(res)-1):
#     if(int(res[i],2)^int(res[i+1],2)):
