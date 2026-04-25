from app.auth import hash_password

# Test with a long password
long_password = "a" * 100 
print("Testing long password...")
hashed = hash_password(long_password)
print("Hashed successfully:", hashed[:20] + "...")

# Test with unicode
unicode_password = "ä" * 50 
print("Testing unicode password...")
try:
    hashed2 = hash_password(unicode_password)
    print("Hashed successfully:", hashed2[:20] + "...")
except Exception as e:
    print("Error:", e)