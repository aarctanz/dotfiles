n = int(input())

for i in range(n):
    s = input()
    
    if (s.endswith("us")):
        print(s[:-2] + "i")