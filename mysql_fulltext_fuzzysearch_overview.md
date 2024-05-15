Using MySQL's full-text search capabilities can be a useful approach to handle the variations in the way artists and songs are recorded, but there are some considerations to keep in mind. Full-text search is good for finding matches in text fields even when there are slight differences, such as variations in punctuation or word order. However, it's not perfect for all types of fuzzy matching, especially when the differences are more significant.

Here's a step-by-step approach you can take to match your Billboard list with your personal library:

1. **Normalize Your Data**: Before performing the full-text search, it's a good idea to normalize the data to reduce the variations. This can include converting all text to lowercase, removing punctuation, and possibly even standardizing common variations in artist names or song titles.

2. **Use Full-Text Search**: Implement full-text indexing on the relevant columns in your MySQL database (e.g., `artist` and `title`). Full-text search will allow you to find records that are close matches.

3. **Leverage String Similarity Functions**: For cases where full-text search may not be sufficient, you can use additional string similarity functions. MySQL 8.0 supports functions like `SOUNDEX`, `LEVENSHTEIN`, and `METAPHONE` which can help identify records with slight spelling differences.

Here's an outline of how you can implement this:

### Step 1: Normalize the Data

You can use SQL functions to create normalized versions of your columns.

```sql
-- Create normalized versions of your columns
ALTER TABLE your_library ADD COLUMN artist_normalized VARCHAR(255);
ALTER TABLE your_library ADD COLUMN title_normalized VARCHAR(255);

UPDATE your_library 
SET artist_normalized = LOWER(REPLACE(REPLACE(artist, '.', ''), ',', '')),
    title_normalized = LOWER(REPLACE(REPLACE(title, '.', ''), ',', ''));
```

Do the same normalization for your Billboard list.

### Step 2: Implement Full-Text Search

Create a full-text index on the normalized columns.

```sql
-- Create full-text indexes
ALTER TABLE your_library ADD FULLTEXT(artist_normalized, title_normalized);
```

Perform a full-text search query:

```sql
SELECT * FROM your_library
WHERE MATCH(artist_normalized, title_normalized) 
AGAINST ('search_artist_normalized search_title_normalized' IN NATURAL LANGUAGE MODE);
```

### Step 3: Use String Similarity Functions

If full-text search isn't providing the desired results, use string similarity functions. Here’s an example of using `LEVENSHTEIN` to find close matches:

```sql
-- Example using LEVENSHTEIN function
SELECT *, 
       LEVENSHTEIN(artist_normalized, 'search_artist_normalized') AS artist_distance,
       LEVENSHTEIN(title_normalized, 'search_title_normalized') AS title_distance
FROM your_library
HAVING artist_distance < threshold AND title_distance < threshold
ORDER BY artist_distance + title_distance
LIMIT 1;
```

You would replace `threshold` with a suitable value depending on how similar the strings need to be. Smaller thresholds mean stricter matching.

### Combining Both Approaches

To get the best results, you may want to combine both full-text search and string similarity measures. First, use full-text search to narrow down potential matches, and then apply string similarity functions to rank these matches.

```sql
-- Full-text search to narrow down candidates
SELECT *,
       LEVENSHTEIN(artist_normalized, 'search_artist_normalized') AS artist_distance,
       LEVENSHTEIN(title_normalized, 'search_title_normalized') AS title_distance
FROM your_library
WHERE MATCH(artist_normalized, title_normalized) 
AGAINST ('search_artist_normalized search_title_normalized' IN NATURAL LANGUAGE MODE)
HAVING artist_distance < threshold AND title_distance < threshold
ORDER BY artist_distance + title_distance
LIMIT 1;
```

### Summary

Using MySQL's full-text search can be a good starting point, and combining it with string similarity functions like `LEVENSHTEIN` can improve the accuracy of your matches. Normalizing your data is crucial to minimize variations that can hinder accurate matching. This approach should help you reliably determine if each song in the Billboard list is present in your personal library.