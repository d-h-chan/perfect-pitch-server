BEGIN;

TRUNCATE
  scores
  RESTART IDENTITY CASCADE;

INSERT INTO scores (user_name, score, difficulty)
VALUES
  ('lonny', '20', 'hard'),
  ('josh', '15', 'easy');

COMMIT;
