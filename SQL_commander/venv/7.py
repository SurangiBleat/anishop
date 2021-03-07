# DIOF - 2
a=int(input())
b=int(input())
c=int(input())
d=int(input())
e=int(input())
kor=0
for x in range(1001):
    if (a*x**3+b*x**2+c*x+d)==0 and x!=e:
        kor+=1
print(kor)

