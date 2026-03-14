# 🧩 Git Merge Conflict Resolution Guide

## 📘 What is a Merge Conflict?
A **merge conflict** happens when two branches change the same part of a file differently.  
Git can’t automatically decide which version to keep — so it asks **you** to resolve it manually.

---

## 🧭 Quick Diagnosis
Run:
```bash
git status
```

You might see something like:
```
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  both modified:   src/pages/Admin_auction.js
  both modified:   src/pages/Auction/Auction.js
```

That means these files have conflicts that need to be fixed.

---

## 🧰 Step-by-Step: Resolving Merge Conflicts

### 1. Identify conflicted files
Run:
```bash
git diff --name-only --diff-filter=U
```
This lists **unmerged files**.

---

### 2. Open the conflicted file(s)
In VS Code (or any editor), open each file listed.  
You’ll see something like this:

```js
// your local changes
// incoming changes (from the other branch)
```

---

### 3. Choose which version to keep
You have 3 options:
- ✅ **Accept Current Change** → Keep *your* version  
- ✅ **Accept Incoming Change** → Keep *the other branch’s* version  
- ✅ **Accept Both Changes** → Keep both parts (manually edit afterward)

👉 Use VS Code’s merge toolbar or edit manually and delete all markers:
```
<<<<<<<
=======
>>>>>>>
```

---

### 4. Mark conflicts as resolved
Once each conflicted file looks clean, run:
```bash
git add <filename>
```

Example:
```bash
git add src/pages/Admin_auction.js
git add src/pages/Auction/Auction.js
```

---

### 5. Finalize the merge
When all files are added, complete the merge:
```bash
git commit
```

Or skip the editor:
```bash
git commit -m "Resolved merge conflicts"
```

---

### 6. Push the changes
```bash
git push
```

---

## ⚡ Optional Commands

### Abort the merge (start over)
If everything goes wrong:
```bash
git merge --abort
```

---

### See all conflicted files quickly
```bash
git diff --name-only --diff-filter=U
```

---

### Force re-stage everything (if stuck)
```bash
git restore --staged .
git add .
git commit -m "Force resolved all conflicts"
```

---

## 🧠 Pro Tips

- Always **pull latest changes** before starting a new feature branch:
  ```bash
  git pull origin main
  ```
- Commit frequently. Smaller commits → easier merges.
- Never leave conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) inside code.
- VS Code shows helpful buttons at the top of conflicts — use them!
- After resolving conflicts, run and test your app to ensure everything still works.

---

## 🩵 Common Errors & Fixes

| Error Message | Meaning | Fix |
|----------------|----------|-----|
| `All conflicts fixed but you are still merging.` | You resolved everything but didn’t commit yet. | Run `git commit` |
| `fatal: pathspec did not match any files` | You added a wrong path. | Use `git status` to find correct file path |
| `Committing is not possible because you have unmerged files.` | Git still sees conflicts. | Double-check for conflict markers, then `git add` again |
| `error: you need to resolve your current index first` | A merge is in progress. | Either resolve and `git commit` or `git merge --abort` |

---

✅ **That’s it!** You’ve now got a complete, reusable conflict-handling playbook.
