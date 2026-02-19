import re

# Read both files
with open(r'c:\Users\derek\OneDrive\Documents\IST4910\SMART Program Campus Safety Optimization.html', 'r', encoding='utf-8') as f:
    html = f.read()
with open(r'c:\Users\derek\OneDrive\Documents\IST4910\smart-app.js', 'r', encoding='utf-8') as f:
    js = f.read()

print("=" * 50)
print("CROSS-VALIDATION REPORT")  
print("=" * 50)

# 1. Check all onclick handlers have matching functions
print("\n1. ONCLICK HANDLERS vs JS FUNCTIONS:")
onclicks = re.findall(r'onclick="([^"]+)"', html)
for handler in sorted(set(onclicks)):
    fn_name = re.match(r'(\w+)', handler)
    if fn_name:
        name = fn_name.group(1)
        if 'function ' + name in js or name in ['this']:
            print(f"   OK: {name}()")
        else:
            print(f"   MISSING: {name}() not found in JS!")

# 2. Check all element IDs referenced in JS exist in HTML
print("\n2. JS getElementById REFERENCES vs HTML IDs:")
js_ids = re.findall(r"getElementById\('([^']+)'\)", js)
html_ids = re.findall(r'id="([^"]+)"', html)
for jid in sorted(set(js_ids)):
    if jid in html_ids:
        print(f"   OK: #{jid}")
    else:
        print(f"   MISSING IN HTML: #{jid}")

# 3. Check loading-screen initialization flow
print("\n3. LOADING FLOW CHECK:")
if 'DOMContentLoaded' in js:
    print("   OK: DOMContentLoaded listener exists in JS")
else:
    print("   MISSING: No DOMContentLoaded in JS!")

if "loading-screen" in js and "classList.add('hidden')" in js:
    print("   OK: Loading screen hide logic exists")
else:
    print("   MISSING: Loading screen hide logic!")
    
if "login-screen" in js and "classList.remove('hidden')" in js:
    print("   OK: Login screen show logic exists")
else:
    print("   MISSING: Login screen show logic!")

# 4. Check for syntax issues
print("\n4. JS SYNTAX CHECK:")
opens = 0
for i, line in enumerate(js.split('\n')):
    for ch in line:
        if ch in '({[': opens += 1
        elif ch in ')}]': opens -= 1
    if opens < 0:
        print(f"   UNBALANCED at line {i+1}")
        break
if opens == 0:
    print(f"   OK: All brackets balanced")
elif opens > 0:
    print(f"   ERROR: {opens} unclosed brackets")

# 5. Check for template literals (ES6 issue)
print("\n5. ES6 TEMPLATE LITERAL CHECK:")
backtick_count = js.count('`')
if backtick_count > 0:
    print(f"   WARNING: {backtick_count} backtick(s) found - may cause parse errors!")
    for i, line in enumerate(js.split('\n')):
        if '`' in line:
            print(f"   Line {i+1}: {line.strip()[:80]}")
else:
    print("   OK: No template literals (ES5 safe)")

# 6. Check for arrow functions
print("\n6. ARROW FUNCTION CHECK:")
arrows = re.findall(r'=>', js)
if arrows:
    print(f"   WARNING: {len(arrows)} arrow function(s) found!")
else:
    print("   OK: No arrow functions (ES5 safe)")

# 7. Check const/let
print("\n7. CONST/LET CHECK:")
const_count = len(re.findall(r'\bconst\b', js))
let_count = len(re.findall(r'\blet\b', js))
print(f"   const: {const_count}, let: {let_count}")
if const_count > 0 or let_count > 0:
    print("   NOTE: const/let are fine in all modern browsers")

# 8. Verify no duplicate function declarations
print("\n8. DUPLICATE FUNCTION CHECK:")
fn_decls = re.findall(r'function (\w+)\s*\(', js)
seen = {}
for fn in fn_decls:
    if fn in seen:
        print(f"   DUPLICATE: {fn}() declared multiple times!")
    seen[fn] = True
if len(fn_decls) == len(seen):
    print(f"   OK: {len(seen)} unique functions, no duplicates")

print("\n" + "=" * 50)
print("VALIDATION COMPLETE")
print("=" * 50)
