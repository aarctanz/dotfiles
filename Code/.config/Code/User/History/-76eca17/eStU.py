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