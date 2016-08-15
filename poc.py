from sys import stdin, stdout
import re

with open('first-names-female.txt') as f:
    female_names = f.read().splitlines()
with open('first-names-male.txt') as f:
    male_names = f.read().splitlines()
with open('last-names.txt') as f:
    last_names = f.read().splitlines()

intsex_names = female_names + male_names

stdout.write('SLK: ')
slk = stdin.readline().strip()

slk_gender = slk[-1:]
slk_first = slk[3:5].replace('2', '.')
slk_last = slk[0:3].replace('2', '.')
slk_dob = slk[5:13]

if slk_gender == '1':
    first_names = male_names
elif slk_gender == '2':
    first_names = female_names
else:
    first_names = intsex_names

first = [name for name in first_names if re.match('.' + slk_first, name) is not None]
last = [name for name in last_names if re.match('.' + slk_last[0:2] + '.' + slk_last[2], name) is not None]
print("First names:")
print(first)
print("Last names:")
print(last)
print("Date of birth: {}/{}/{}".format(slk_dob[0:2], slk_dob[2:4], slk_dob[4:8]))
print("Gender: {}".format('Male' if slk_gender == '1' else 'Female'))
