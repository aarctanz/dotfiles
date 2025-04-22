n = int(input())

res = []

def gen(prev):
    if len(prev)==n:
        return
    res.append(prev)
    gen(prev+"0")
    gen(prev+"1")

gen("")
print(res)