import { db } from "./index";
import { units, lessons, questions, achievements, users } from "./schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  // Check if already seeded
  const existingUnits = await db.select().from(units).limit(1);
  if (existingUnits.length > 0) return;

  // Create default user
  await db.insert(users).values({
    username: "learner",
    displayName: "German Learner",
    xp: 0,
    level: 1,
    hearts: 5,
    gems: 50,
    currentStreak: 0,
    longestStreak: 0,
  });

  // ============ UNITS ============
  const unitData = [
    { orderIndex: 1, title: "Basics 1", description: "Greetings and simple phrases", icon: "👋", color: "green" },
    { orderIndex: 2, title: "Basics 2", description: "Common nouns and articles", icon: "📚", color: "blue" },
    { orderIndex: 3, title: "Food & Drink", description: "Order food and drinks", icon: "🍽️", color: "orange" },
    { orderIndex: 4, title: "Animals", description: "Learn animal names", icon: "🐾", color: "purple" },
    { orderIndex: 5, title: "Numbers", description: "Count in German", icon: "🔢", color: "red" },
    { orderIndex: 6, title: "Family", description: "Family members", icon: "👨‍👩‍👧‍👦", color: "pink" },
    { orderIndex: 7, title: "Colors & Clothes", description: "Colors and clothing", icon: "🎨", color: "yellow" },
    { orderIndex: 8, title: "Travel", description: "Getting around", icon: "✈️", color: "teal" },
  ];

  const insertedUnits = await db.insert(units).values(unitData).returning();

  // ============ LESSONS & QUESTIONS ============
  // UNIT 1: Basics 1
  const u1 = insertedUnits[0].id;
  const u1Lessons = await db.insert(lessons).values([
    { unitId: u1, orderIndex: 1, title: "Hello!", description: "Basic greetings", type: "standard", xpReward: 10 },
    { unitId: u1, orderIndex: 2, title: "Goodbye", description: "Saying farewell", type: "standard", xpReward: 10 },
    { unitId: u1, orderIndex: 3, title: "Please & Thanks", description: "Polite phrases", type: "standard", xpReward: 10 },
    { unitId: u1, orderIndex: 4, title: "Introductions", description: "Introduce yourself", type: "standard", xpReward: 15 },
    { unitId: u1, orderIndex: 5, title: "Basics Review", description: "Test what you learned", type: "review", xpReward: 20 },
  ]).returning();

  // Lesson 1: Hello!
  await db.insert(questions).values([
    { lessonId: u1Lessons[0].id, orderIndex: 1, type: "translate", prompt: "Translate: Hello!", correctAnswer: "Hallo!", options: JSON.stringify(["Hallo!", "Tschüss!", "Danke!", "Bitte!"]), hint: "A common greeting" },
    { lessonId: u1Lessons[0].id, orderIndex: 2, type: "translate", prompt: "Translate: Good morning", correctAnswer: "Guten Morgen", options: JSON.stringify(["Guten Morgen", "Guten Abend", "Gute Nacht", "Guten Tag"]), hint: "Morning greeting" },
    { lessonId: u1Lessons[0].id, orderIndex: 3, type: "translate", prompt: "Translate: Good day", correctAnswer: "Guten Tag", options: JSON.stringify(["Guten Tag", "Guten Morgen", "Guten Abend", "Gute Nacht"]), hint: "Daytime greeting" },
    { lessonId: u1Lessons[0].id, orderIndex: 4, type: "match", prompt: "What does 'Hallo' mean?", correctAnswer: "Hello", options: JSON.stringify(["Hello", "Goodbye", "Thanks", "Please"]), hint: "Think English cognate" },
    { lessonId: u1Lessons[0].id, orderIndex: 5, type: "translate", prompt: "Translate: Good evening", correctAnswer: "Guten Abend", options: JSON.stringify(["Guten Abend", "Guten Morgen", "Guten Tag", "Gute Nacht"]), hint: "Evening greeting" },
    { lessonId: u1Lessons[0].id, orderIndex: 6, type: "fill", prompt: "Guten _____ (morning)", correctAnswer: "Morgen", options: JSON.stringify(["Morgen", "Abend", "Tag", "Nacht"]), hint: "The German word for morning" },
  ]);

  // Lesson 2: Goodbye
  await db.insert(questions).values([
    { lessonId: u1Lessons[1].id, orderIndex: 1, type: "translate", prompt: "Translate: Goodbye", correctAnswer: "Tschüss", options: JSON.stringify(["Tschüss", "Hallo", "Danke", "Bitte"]), hint: "Informal farewell" },
    { lessonId: u1Lessons[1].id, orderIndex: 2, type: "translate", prompt: "Translate: Auf Wiedersehen", correctAnswer: "Goodbye (formal)", options: JSON.stringify(["Goodbye (formal)", "Hello", "Good night", "See you later"]), hint: "Formal farewell" },
    { lessonId: u1Lessons[1].id, orderIndex: 3, type: "translate", prompt: "Translate: Good night", correctAnswer: "Gute Nacht", options: JSON.stringify(["Gute Nacht", "Guten Morgen", "Guten Tag", "Guten Abend"]), hint: "Nighttime farewell" },
    { lessonId: u1Lessons[1].id, orderIndex: 4, type: "match", prompt: "What does 'Bis bald' mean?", correctAnswer: "See you soon", options: JSON.stringify(["See you soon", "Goodbye", "Good night", "Hello again"]), hint: "'Bald' means 'soon'" },
    { lessonId: u1Lessons[1].id, orderIndex: 5, type: "fill", prompt: "Auf _____  (goodbye formal)", correctAnswer: "Wiedersehen", options: JSON.stringify(["Wiedersehen", "Morgen", "Nacht", "Abend"]), hint: "Literally 'seeing again'" },
  ]);

  // Lesson 3: Please & Thanks
  await db.insert(questions).values([
    { lessonId: u1Lessons[2].id, orderIndex: 1, type: "translate", prompt: "Translate: Please", correctAnswer: "Bitte", options: JSON.stringify(["Bitte", "Danke", "Hallo", "Tschüss"]), hint: "Polite word for requests" },
    { lessonId: u1Lessons[2].id, orderIndex: 2, type: "translate", prompt: "Translate: Thank you", correctAnswer: "Danke", options: JSON.stringify(["Danke", "Bitte", "Hallo", "Ja"]), hint: "Expression of gratitude" },
    { lessonId: u1Lessons[2].id, orderIndex: 3, type: "translate", prompt: "Translate: Thank you very much", correctAnswer: "Vielen Dank", options: JSON.stringify(["Vielen Dank", "Danke schön", "Bitte schön", "Nichts"]), hint: "'Vielen' means 'many/much'" },
    { lessonId: u1Lessons[2].id, orderIndex: 4, type: "match", prompt: "What does 'Entschuldigung' mean?", correctAnswer: "Excuse me / Sorry", options: JSON.stringify(["Excuse me / Sorry", "Thank you", "Please", "Hello"]), hint: "Used when apologizing" },
    { lessonId: u1Lessons[2].id, orderIndex: 5, type: "translate", prompt: "Translate: You're welcome", correctAnswer: "Bitte schön", options: JSON.stringify(["Bitte schön", "Danke schön", "Vielen Dank", "Tschüss"]), hint: "'Bitte' + 'schön'" },
    { lessonId: u1Lessons[2].id, orderIndex: 6, type: "fill", prompt: "Danke _____ (thank you kindly)", correctAnswer: "schön", options: JSON.stringify(["schön", "sehr", "gut", "viel"]), hint: "Means 'beautiful' or 'nice'" },
  ]);

  // Lesson 4: Introductions
  await db.insert(questions).values([
    { lessonId: u1Lessons[3].id, orderIndex: 1, type: "translate", prompt: "Translate: My name is...", correctAnswer: "Ich heiße...", options: JSON.stringify(["Ich heiße...", "Du heißt...", "Er heißt...", "Ich bin..."]), hint: "'Heißen' means 'to be called'" },
    { lessonId: u1Lessons[3].id, orderIndex: 2, type: "translate", prompt: "Translate: What is your name?", correctAnswer: "Wie heißt du?", options: JSON.stringify(["Wie heißt du?", "Wer bist du?", "Wo bist du?", "Was machst du?"]), hint: "Informal question" },
    { lessonId: u1Lessons[3].id, orderIndex: 3, type: "translate", prompt: "Translate: I am (name)", correctAnswer: "Ich bin", options: JSON.stringify(["Ich bin", "Du bist", "Ich heiße", "Er ist"]), hint: "Using 'sein' (to be)" },
    { lessonId: u1Lessons[3].id, orderIndex: 4, type: "match", prompt: "What does 'Freut mich' mean?", correctAnswer: "Nice to meet you", options: JSON.stringify(["Nice to meet you", "I am happy", "Thank you", "Goodbye"]), hint: "Said when meeting someone" },
    { lessonId: u1Lessons[3].id, orderIndex: 5, type: "translate", prompt: "Translate: How are you?", correctAnswer: "Wie geht es dir?", options: JSON.stringify(["Wie geht es dir?", "Wie heißt du?", "Wo bist du?", "Was machst du?"]), hint: "Asking about wellbeing" },
    { lessonId: u1Lessons[3].id, orderIndex: 6, type: "fill", prompt: "Ich _____ Anna. (I am called Anna)", correctAnswer: "heiße", options: JSON.stringify(["heiße", "bin", "heißt", "ist"]), hint: "First person of 'heißen'" },
  ]);

  // Lesson 5: Review
  await db.insert(questions).values([
    { lessonId: u1Lessons[4].id, orderIndex: 1, type: "translate", prompt: "Translate: Hello, my name is Max", correctAnswer: "Hallo, ich heiße Max", options: JSON.stringify(["Hallo, ich heiße Max", "Tschüss, ich bin Max", "Hallo, du heißt Max", "Guten Tag Max"]), hint: "Greeting + introduction" },
    { lessonId: u1Lessons[4].id, orderIndex: 2, type: "match", prompt: "Match: Guten Morgen", correctAnswer: "Good morning", options: JSON.stringify(["Good morning", "Good evening", "Good night", "Goodbye"]), hint: "Morning greeting" },
    { lessonId: u1Lessons[4].id, orderIndex: 3, type: "translate", prompt: "Translate: Excuse me, good evening", correctAnswer: "Entschuldigung, guten Abend", options: JSON.stringify(["Entschuldigung, guten Abend", "Bitte, guten Morgen", "Danke, gute Nacht", "Tschüss, auf Wiedersehen"]) },
    { lessonId: u1Lessons[4].id, orderIndex: 4, type: "fill", prompt: "Wie _____ es dir? (How are you?)", correctAnswer: "geht", options: JSON.stringify(["geht", "ist", "heißt", "bist"]), hint: "From 'gehen' (to go)" },
    { lessonId: u1Lessons[4].id, orderIndex: 5, type: "translate", prompt: "Translate: Goodbye, see you soon!", correctAnswer: "Tschüss, bis bald!", options: JSON.stringify(["Tschüss, bis bald!", "Hallo, guten Tag!", "Danke, bitte!", "Auf Wiedersehen, gute Nacht!"]) },
    { lessonId: u1Lessons[4].id, orderIndex: 6, type: "match", prompt: "What does 'Vielen Dank' mean?", correctAnswer: "Thank you very much", options: JSON.stringify(["Thank you very much", "Please", "You're welcome", "Excuse me"]) },
    { lessonId: u1Lessons[4].id, orderIndex: 7, type: "translate", prompt: "Translate: Nice to meet you", correctAnswer: "Freut mich", options: JSON.stringify(["Freut mich", "Danke schön", "Bitte schön", "Ich heiße"]) },
  ]);

  // UNIT 2: Basics 2
  const u2 = insertedUnits[1].id;
  const u2Lessons = await db.insert(lessons).values([
    { unitId: u2, orderIndex: 1, title: "Articles", description: "Der, die, das", type: "standard", xpReward: 10 },
    { unitId: u2, orderIndex: 2, title: "Common Nouns", description: "Everyday objects", type: "standard", xpReward: 10 },
    { unitId: u2, orderIndex: 3, title: "Pronouns", description: "I, you, he, she", type: "standard", xpReward: 10 },
    { unitId: u2, orderIndex: 4, title: "Simple Verbs", description: "To be, to have", type: "standard", xpReward: 15 },
  ]).returning();

  await db.insert(questions).values([
    { lessonId: u2Lessons[0].id, orderIndex: 1, type: "translate", prompt: "Which article does 'Mann' (man) use?", correctAnswer: "der", options: JSON.stringify(["der", "die", "das", "ein"]), hint: "Masculine article" },
    { lessonId: u2Lessons[0].id, orderIndex: 2, type: "translate", prompt: "Which article does 'Frau' (woman) use?", correctAnswer: "die", options: JSON.stringify(["die", "der", "das", "eine"]), hint: "Feminine article" },
    { lessonId: u2Lessons[0].id, orderIndex: 3, type: "translate", prompt: "Which article does 'Kind' (child) use?", correctAnswer: "das", options: JSON.stringify(["das", "der", "die", "ein"]), hint: "Neuter article" },
    { lessonId: u2Lessons[0].id, orderIndex: 4, type: "match", prompt: "What are the three German articles?", correctAnswer: "der, die, das", options: JSON.stringify(["der, die, das", "el, la, lo", "le, la, les", "the, a, an"]), hint: "Masculine, feminine, neuter" },
    { lessonId: u2Lessons[0].id, orderIndex: 5, type: "fill", prompt: "_____ Buch (the book)", correctAnswer: "Das", options: JSON.stringify(["Das", "Der", "Die", "Ein"]), hint: "Buch is neuter" },
    { lessonId: u2Lessons[0].id, orderIndex: 6, type: "fill", prompt: "_____ Katze (the cat)", correctAnswer: "Die", options: JSON.stringify(["Die", "Der", "Das", "Eine"]), hint: "Katze is feminine" },
  ]);

  await db.insert(questions).values([
    { lessonId: u2Lessons[1].id, orderIndex: 1, type: "translate", prompt: "Translate: the water", correctAnswer: "das Wasser", options: JSON.stringify(["das Wasser", "der Wasser", "die Wasser", "das Brot"]), hint: "Wasser is neuter" },
    { lessonId: u2Lessons[1].id, orderIndex: 2, type: "translate", prompt: "Translate: the bread", correctAnswer: "das Brot", options: JSON.stringify(["das Brot", "der Brot", "die Brot", "das Wasser"]), hint: "Brot is neuter" },
    { lessonId: u2Lessons[1].id, orderIndex: 3, type: "match", prompt: "What does 'der Hund' mean?", correctAnswer: "the dog", options: JSON.stringify(["the dog", "the cat", "the bird", "the fish"]), hint: "Man's best friend" },
    { lessonId: u2Lessons[1].id, orderIndex: 4, type: "translate", prompt: "Translate: the house", correctAnswer: "das Haus", options: JSON.stringify(["das Haus", "der Haus", "die Haus", "das Buch"]), hint: "Similar to English" },
    { lessonId: u2Lessons[1].id, orderIndex: 5, type: "fill", prompt: "Das _____ (the book)", correctAnswer: "Buch", options: JSON.stringify(["Buch", "Haus", "Wasser", "Brot"]), hint: "Similar to English 'book'" },
  ]);

  await db.insert(questions).values([
    { lessonId: u2Lessons[2].id, orderIndex: 1, type: "translate", prompt: "Translate: I", correctAnswer: "ich", options: JSON.stringify(["ich", "du", "er", "wir"]), hint: "First person singular" },
    { lessonId: u2Lessons[2].id, orderIndex: 2, type: "translate", prompt: "Translate: you (informal)", correctAnswer: "du", options: JSON.stringify(["du", "ich", "Sie", "er"]), hint: "Informal 'you'" },
    { lessonId: u2Lessons[2].id, orderIndex: 3, type: "translate", prompt: "Translate: he", correctAnswer: "er", options: JSON.stringify(["er", "sie", "es", "ich"]), hint: "Masculine pronoun" },
    { lessonId: u2Lessons[2].id, orderIndex: 4, type: "translate", prompt: "Translate: she", correctAnswer: "sie", options: JSON.stringify(["sie", "er", "es", "du"]), hint: "Feminine pronoun" },
    { lessonId: u2Lessons[2].id, orderIndex: 5, type: "match", prompt: "What does 'wir' mean?", correctAnswer: "we", options: JSON.stringify(["we", "they", "you all", "I"]), hint: "First person plural" },
    { lessonId: u2Lessons[2].id, orderIndex: 6, type: "fill", prompt: "_____ sind Studenten. (We are students)", correctAnswer: "Wir", options: JSON.stringify(["Wir", "Sie", "Ihr", "Du"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u2Lessons[3].id, orderIndex: 1, type: "translate", prompt: "Translate: I am", correctAnswer: "ich bin", options: JSON.stringify(["ich bin", "du bist", "ich habe", "er ist"]), hint: "Verb 'sein'" },
    { lessonId: u2Lessons[3].id, orderIndex: 2, type: "translate", prompt: "Translate: I have", correctAnswer: "ich habe", options: JSON.stringify(["ich habe", "ich bin", "du hast", "er hat"]), hint: "Verb 'haben'" },
    { lessonId: u2Lessons[3].id, orderIndex: 3, type: "fill", prompt: "Du _____ müde. (You are tired)", correctAnswer: "bist", options: JSON.stringify(["bist", "bin", "ist", "sind"]), hint: "Second person 'sein'" },
    { lessonId: u2Lessons[3].id, orderIndex: 4, type: "fill", prompt: "Er _____ einen Hund. (He has a dog)", correctAnswer: "hat", options: JSON.stringify(["hat", "habe", "hast", "haben"]), hint: "Third person 'haben'" },
    { lessonId: u2Lessons[3].id, orderIndex: 5, type: "match", prompt: "What does 'Sie sind' mean?", correctAnswer: "They are / You are (formal)", options: JSON.stringify(["They are / You are (formal)", "She is", "We are", "I am"]) },
    { lessonId: u2Lessons[3].id, orderIndex: 6, type: "translate", prompt: "Translate: We have", correctAnswer: "wir haben", options: JSON.stringify(["wir haben", "wir sind", "sie haben", "ihr habt"]) },
  ]);

  // UNIT 3: Food & Drink
  const u3 = insertedUnits[2].id;
  const u3Lessons = await db.insert(lessons).values([
    { unitId: u3, orderIndex: 1, title: "Drinks", description: "Water, coffee, beer", type: "standard", xpReward: 10 },
    { unitId: u3, orderIndex: 2, title: "Fruits", description: "Common fruits", type: "standard", xpReward: 10 },
    { unitId: u3, orderIndex: 3, title: "Meals", description: "Breakfast, lunch, dinner", type: "standard", xpReward: 10 },
    { unitId: u3, orderIndex: 4, title: "At the Restaurant", description: "Ordering food", type: "standard", xpReward: 15 },
  ]).returning();

  await db.insert(questions).values([
    { lessonId: u3Lessons[0].id, orderIndex: 1, type: "translate", prompt: "Translate: the coffee", correctAnswer: "der Kaffee", options: JSON.stringify(["der Kaffee", "das Kaffee", "die Kaffee", "der Tee"]) },
    { lessonId: u3Lessons[0].id, orderIndex: 2, type: "translate", prompt: "Translate: the tea", correctAnswer: "der Tee", options: JSON.stringify(["der Tee", "der Kaffee", "das Wasser", "der Saft"]) },
    { lessonId: u3Lessons[0].id, orderIndex: 3, type: "translate", prompt: "Translate: the beer", correctAnswer: "das Bier", options: JSON.stringify(["das Bier", "der Wein", "der Saft", "das Wasser"]) },
    { lessonId: u3Lessons[0].id, orderIndex: 4, type: "match", prompt: "What does 'der Wein' mean?", correctAnswer: "the wine", options: JSON.stringify(["the wine", "the beer", "the water", "the juice"]) },
    { lessonId: u3Lessons[0].id, orderIndex: 5, type: "fill", prompt: "Ich trinke _____ (I drink water)", correctAnswer: "Wasser", options: JSON.stringify(["Wasser", "Kaffee", "Bier", "Tee"]) },
    { lessonId: u3Lessons[0].id, orderIndex: 6, type: "translate", prompt: "Translate: the milk", correctAnswer: "die Milch", options: JSON.stringify(["die Milch", "der Milch", "das Milch", "der Saft"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u3Lessons[1].id, orderIndex: 1, type: "translate", prompt: "Translate: the apple", correctAnswer: "der Apfel", options: JSON.stringify(["der Apfel", "die Banane", "die Orange", "die Birne"]) },
    { lessonId: u3Lessons[1].id, orderIndex: 2, type: "translate", prompt: "Translate: the banana", correctAnswer: "die Banane", options: JSON.stringify(["die Banane", "der Apfel", "die Erdbeere", "die Orange"]) },
    { lessonId: u3Lessons[1].id, orderIndex: 3, type: "match", prompt: "What does 'die Erdbeere' mean?", correctAnswer: "the strawberry", options: JSON.stringify(["the strawberry", "the blueberry", "the raspberry", "the cherry"]) },
    { lessonId: u3Lessons[1].id, orderIndex: 4, type: "translate", prompt: "Translate: the orange", correctAnswer: "die Orange", options: JSON.stringify(["die Orange", "der Apfel", "die Banane", "die Zitrone"]) },
    { lessonId: u3Lessons[1].id, orderIndex: 5, type: "fill", prompt: "Der _____ ist rot. (The apple is red)", correctAnswer: "Apfel", options: JSON.stringify(["Apfel", "Banane", "Orange", "Birne"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u3Lessons[2].id, orderIndex: 1, type: "translate", prompt: "Translate: breakfast", correctAnswer: "das Frühstück", options: JSON.stringify(["das Frühstück", "das Mittagessen", "das Abendessen", "der Snack"]) },
    { lessonId: u3Lessons[2].id, orderIndex: 2, type: "translate", prompt: "Translate: lunch", correctAnswer: "das Mittagessen", options: JSON.stringify(["das Mittagessen", "das Frühstück", "das Abendessen", "der Nachtisch"]) },
    { lessonId: u3Lessons[2].id, orderIndex: 3, type: "translate", prompt: "Translate: dinner", correctAnswer: "das Abendessen", options: JSON.stringify(["das Abendessen", "das Frühstück", "das Mittagessen", "der Snack"]) },
    { lessonId: u3Lessons[2].id, orderIndex: 4, type: "match", prompt: "What does 'Ich bin hungrig' mean?", correctAnswer: "I am hungry", options: JSON.stringify(["I am hungry", "I am thirsty", "I am tired", "I am happy"]) },
    { lessonId: u3Lessons[2].id, orderIndex: 5, type: "fill", prompt: "Ich bin _____. (I am thirsty)", correctAnswer: "durstig", options: JSON.stringify(["durstig", "hungrig", "müde", "glücklich"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u3Lessons[3].id, orderIndex: 1, type: "translate", prompt: "Translate: I would like...", correctAnswer: "Ich möchte...", options: JSON.stringify(["Ich möchte...", "Ich habe...", "Ich bin...", "Ich brauche..."]) },
    { lessonId: u3Lessons[3].id, orderIndex: 2, type: "translate", prompt: "Translate: The bill, please", correctAnswer: "Die Rechnung, bitte", options: JSON.stringify(["Die Rechnung, bitte", "Das Menü, bitte", "Der Tisch, bitte", "Das Essen, bitte"]) },
    { lessonId: u3Lessons[3].id, orderIndex: 3, type: "match", prompt: "What does 'die Speisekarte' mean?", correctAnswer: "the menu", options: JSON.stringify(["the menu", "the bill", "the table", "the waiter"]) },
    { lessonId: u3Lessons[3].id, orderIndex: 4, type: "fill", prompt: "Ich möchte einen _____, bitte. (I'd like a coffee, please)", correctAnswer: "Kaffee", options: JSON.stringify(["Kaffee", "Tisch", "Rechnung", "Kellner"]) },
    { lessonId: u3Lessons[3].id, orderIndex: 5, type: "translate", prompt: "Translate: Enjoy your meal!", correctAnswer: "Guten Appetit!", options: JSON.stringify(["Guten Appetit!", "Danke schön!", "Auf Wiedersehen!", "Prost!"]) },
    { lessonId: u3Lessons[3].id, orderIndex: 6, type: "translate", prompt: "Translate: Cheers!", correctAnswer: "Prost!", options: JSON.stringify(["Prost!", "Danke!", "Bitte!", "Hallo!"]) },
  ]);

  // UNIT 4: Animals
  const u4 = insertedUnits[3].id;
  const u4Lessons = await db.insert(lessons).values([
    { unitId: u4, orderIndex: 1, title: "Pets", description: "Dogs, cats, and more", type: "standard", xpReward: 10 },
    { unitId: u4, orderIndex: 2, title: "Farm Animals", description: "On the farm", type: "standard", xpReward: 10 },
    { unitId: u4, orderIndex: 3, title: "Wild Animals", description: "In the wild", type: "standard", xpReward: 15 },
  ]).returning();

  await db.insert(questions).values([
    { lessonId: u4Lessons[0].id, orderIndex: 1, type: "translate", prompt: "Translate: the dog", correctAnswer: "der Hund", options: JSON.stringify(["der Hund", "die Katze", "der Vogel", "der Fisch"]) },
    { lessonId: u4Lessons[0].id, orderIndex: 2, type: "translate", prompt: "Translate: the cat", correctAnswer: "die Katze", options: JSON.stringify(["die Katze", "der Hund", "die Maus", "der Vogel"]) },
    { lessonId: u4Lessons[0].id, orderIndex: 3, type: "translate", prompt: "Translate: the bird", correctAnswer: "der Vogel", options: JSON.stringify(["der Vogel", "der Fisch", "die Katze", "der Hund"]) },
    { lessonId: u4Lessons[0].id, orderIndex: 4, type: "match", prompt: "What does 'der Fisch' mean?", correctAnswer: "the fish", options: JSON.stringify(["the fish", "the bird", "the mouse", "the rabbit"]) },
    { lessonId: u4Lessons[0].id, orderIndex: 5, type: "fill", prompt: "Die _____ ist klein. (The mouse is small)", correctAnswer: "Maus", options: JSON.stringify(["Maus", "Katze", "Hund", "Vogel"]) },
    { lessonId: u4Lessons[0].id, orderIndex: 6, type: "translate", prompt: "Translate: the rabbit", correctAnswer: "das Kaninchen", options: JSON.stringify(["das Kaninchen", "die Maus", "der Hamster", "der Vogel"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u4Lessons[1].id, orderIndex: 1, type: "translate", prompt: "Translate: the cow", correctAnswer: "die Kuh", options: JSON.stringify(["die Kuh", "das Pferd", "das Schwein", "das Huhn"]) },
    { lessonId: u4Lessons[1].id, orderIndex: 2, type: "translate", prompt: "Translate: the horse", correctAnswer: "das Pferd", options: JSON.stringify(["das Pferd", "die Kuh", "der Esel", "das Schaf"]) },
    { lessonId: u4Lessons[1].id, orderIndex: 3, type: "match", prompt: "What does 'das Schwein' mean?", correctAnswer: "the pig", options: JSON.stringify(["the pig", "the cow", "the sheep", "the chicken"]) },
    { lessonId: u4Lessons[1].id, orderIndex: 4, type: "translate", prompt: "Translate: the chicken", correctAnswer: "das Huhn", options: JSON.stringify(["das Huhn", "der Hahn", "die Ente", "die Gans"]) },
    { lessonId: u4Lessons[1].id, orderIndex: 5, type: "fill", prompt: "Das _____ gibt Wolle. (The sheep gives wool)", correctAnswer: "Schaf", options: JSON.stringify(["Schaf", "Schwein", "Pferd", "Huhn"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u4Lessons[2].id, orderIndex: 1, type: "translate", prompt: "Translate: the bear", correctAnswer: "der Bär", options: JSON.stringify(["der Bär", "der Wolf", "der Löwe", "der Tiger"]) },
    { lessonId: u4Lessons[2].id, orderIndex: 2, type: "translate", prompt: "Translate: the lion", correctAnswer: "der Löwe", options: JSON.stringify(["der Löwe", "der Tiger", "der Bär", "der Affe"]) },
    { lessonId: u4Lessons[2].id, orderIndex: 3, type: "match", prompt: "What does 'der Elefant' mean?", correctAnswer: "the elephant", options: JSON.stringify(["the elephant", "the giraffe", "the lion", "the bear"]) },
    { lessonId: u4Lessons[2].id, orderIndex: 4, type: "translate", prompt: "Translate: the monkey", correctAnswer: "der Affe", options: JSON.stringify(["der Affe", "der Bär", "der Wolf", "der Fuchs"]) },
    { lessonId: u4Lessons[2].id, orderIndex: 5, type: "fill", prompt: "Der _____ ist schlau. (The fox is clever)", correctAnswer: "Fuchs", options: JSON.stringify(["Fuchs", "Wolf", "Bär", "Affe"]) },
    { lessonId: u4Lessons[2].id, orderIndex: 6, type: "translate", prompt: "Translate: the snake", correctAnswer: "die Schlange", options: JSON.stringify(["die Schlange", "die Spinne", "der Frosch", "die Eidechse"]) },
  ]);

  // UNIT 5: Numbers
  const u5 = insertedUnits[4].id;
  const u5Lessons = await db.insert(lessons).values([
    { unitId: u5, orderIndex: 1, title: "1-10", description: "Count to ten", type: "standard", xpReward: 10 },
    { unitId: u5, orderIndex: 2, title: "11-20", description: "Teens", type: "standard", xpReward: 10 },
    { unitId: u5, orderIndex: 3, title: "Big Numbers", description: "Tens and hundreds", type: "standard", xpReward: 15 },
  ]).returning();

  await db.insert(questions).values([
    { lessonId: u5Lessons[0].id, orderIndex: 1, type: "translate", prompt: "Translate: one", correctAnswer: "eins", options: JSON.stringify(["eins", "zwei", "drei", "vier"]) },
    { lessonId: u5Lessons[0].id, orderIndex: 2, type: "translate", prompt: "Translate: three", correctAnswer: "drei", options: JSON.stringify(["drei", "eins", "zwei", "vier"]) },
    { lessonId: u5Lessons[0].id, orderIndex: 3, type: "match", prompt: "What number is 'fünf'?", correctAnswer: "5", options: JSON.stringify(["5", "4", "6", "7"]) },
    { lessonId: u5Lessons[0].id, orderIndex: 4, type: "translate", prompt: "Translate: seven", correctAnswer: "sieben", options: JSON.stringify(["sieben", "sechs", "acht", "neun"]) },
    { lessonId: u5Lessons[0].id, orderIndex: 5, type: "fill", prompt: "Eins, zwei, _____, vier (1, 2, ?, 4)", correctAnswer: "drei", options: JSON.stringify(["drei", "fünf", "sechs", "sieben"]) },
    { lessonId: u5Lessons[0].id, orderIndex: 6, type: "translate", prompt: "Translate: ten", correctAnswer: "zehn", options: JSON.stringify(["zehn", "neun", "acht", "elf"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u5Lessons[1].id, orderIndex: 1, type: "translate", prompt: "Translate: eleven", correctAnswer: "elf", options: JSON.stringify(["elf", "zwölf", "zehn", "dreizehn"]) },
    { lessonId: u5Lessons[1].id, orderIndex: 2, type: "translate", prompt: "Translate: twelve", correctAnswer: "zwölf", options: JSON.stringify(["zwölf", "elf", "dreizehn", "vierzehn"]) },
    { lessonId: u5Lessons[1].id, orderIndex: 3, type: "match", prompt: "What number is 'fünfzehn'?", correctAnswer: "15", options: JSON.stringify(["15", "14", "16", "50"]) },
    { lessonId: u5Lessons[1].id, orderIndex: 4, type: "translate", prompt: "Translate: twenty", correctAnswer: "zwanzig", options: JSON.stringify(["zwanzig", "dreißig", "vierzig", "fünfzig"]) },
    { lessonId: u5Lessons[1].id, orderIndex: 5, type: "fill", prompt: "Sechzehn, siebzehn, _____ (16, 17, ?)", correctAnswer: "achtzehn", options: JSON.stringify(["achtzehn", "neunzehn", "fünfzehn", "zwanzig"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u5Lessons[2].id, orderIndex: 1, type: "translate", prompt: "Translate: thirty", correctAnswer: "dreißig", options: JSON.stringify(["dreißig", "zwanzig", "vierzig", "fünfzig"]) },
    { lessonId: u5Lessons[2].id, orderIndex: 2, type: "translate", prompt: "Translate: one hundred", correctAnswer: "hundert", options: JSON.stringify(["hundert", "tausend", "zehn", "fünfzig"]) },
    { lessonId: u5Lessons[2].id, orderIndex: 3, type: "match", prompt: "What is 'tausend'?", correctAnswer: "one thousand", options: JSON.stringify(["one thousand", "one hundred", "ten thousand", "one million"]) },
    { lessonId: u5Lessons[2].id, orderIndex: 4, type: "fill", prompt: "Zwanzig, dreißig, _____, fünfzig", correctAnswer: "vierzig", options: JSON.stringify(["vierzig", "sechzig", "siebzig", "achtzig"]) },
    { lessonId: u5Lessons[2].id, orderIndex: 5, type: "translate", prompt: "Translate: twenty-one (note: German reverses!)", correctAnswer: "einundzwanzig", options: JSON.stringify(["einundzwanzig", "zwanzigeins", "zweiundzwanzig", "dreiundzwanzig"]), hint: "In German: one-and-twenty" },
  ]);

  // UNIT 6: Family
  const u6 = insertedUnits[5].id;
  const u6Lessons = await db.insert(lessons).values([
    { unitId: u6, orderIndex: 1, title: "Parents", description: "Mom and Dad", type: "standard", xpReward: 10 },
    { unitId: u6, orderIndex: 2, title: "Siblings", description: "Brothers and sisters", type: "standard", xpReward: 10 },
    { unitId: u6, orderIndex: 3, title: "Extended Family", description: "Grandparents and more", type: "standard", xpReward: 15 },
  ]).returning();

  await db.insert(questions).values([
    { lessonId: u6Lessons[0].id, orderIndex: 1, type: "translate", prompt: "Translate: the mother", correctAnswer: "die Mutter", options: JSON.stringify(["die Mutter", "der Vater", "die Schwester", "die Tochter"]) },
    { lessonId: u6Lessons[0].id, orderIndex: 2, type: "translate", prompt: "Translate: the father", correctAnswer: "der Vater", options: JSON.stringify(["der Vater", "die Mutter", "der Bruder", "der Sohn"]) },
    { lessonId: u6Lessons[0].id, orderIndex: 3, type: "match", prompt: "What does 'die Eltern' mean?", correctAnswer: "the parents", options: JSON.stringify(["the parents", "the children", "the siblings", "the grandparents"]) },
    { lessonId: u6Lessons[0].id, orderIndex: 4, type: "fill", prompt: "Meine _____ heißt Anna. (My mom is called Anna)", correctAnswer: "Mutter", options: JSON.stringify(["Mutter", "Vater", "Schwester", "Tochter"]) },
    { lessonId: u6Lessons[0].id, orderIndex: 5, type: "translate", prompt: "Translate: the family", correctAnswer: "die Familie", options: JSON.stringify(["die Familie", "die Eltern", "die Kinder", "das Haus"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u6Lessons[1].id, orderIndex: 1, type: "translate", prompt: "Translate: the brother", correctAnswer: "der Bruder", options: JSON.stringify(["der Bruder", "die Schwester", "der Vater", "der Sohn"]) },
    { lessonId: u6Lessons[1].id, orderIndex: 2, type: "translate", prompt: "Translate: the sister", correctAnswer: "die Schwester", options: JSON.stringify(["die Schwester", "der Bruder", "die Mutter", "die Tochter"]) },
    { lessonId: u6Lessons[1].id, orderIndex: 3, type: "match", prompt: "What does 'die Geschwister' mean?", correctAnswer: "the siblings", options: JSON.stringify(["the siblings", "the parents", "the children", "the brothers"]) },
    { lessonId: u6Lessons[1].id, orderIndex: 4, type: "translate", prompt: "Translate: the son", correctAnswer: "der Sohn", options: JSON.stringify(["der Sohn", "die Tochter", "der Bruder", "der Vater"]) },
    { lessonId: u6Lessons[1].id, orderIndex: 5, type: "translate", prompt: "Translate: the daughter", correctAnswer: "die Tochter", options: JSON.stringify(["die Tochter", "der Sohn", "die Schwester", "die Mutter"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u6Lessons[2].id, orderIndex: 1, type: "translate", prompt: "Translate: the grandmother", correctAnswer: "die Großmutter", options: JSON.stringify(["die Großmutter", "der Großvater", "die Mutter", "die Tante"]) },
    { lessonId: u6Lessons[2].id, orderIndex: 2, type: "translate", prompt: "Translate: the grandfather", correctAnswer: "der Großvater", options: JSON.stringify(["der Großvater", "die Großmutter", "der Vater", "der Onkel"]) },
    { lessonId: u6Lessons[2].id, orderIndex: 3, type: "match", prompt: "What does 'der Onkel' mean?", correctAnswer: "the uncle", options: JSON.stringify(["the uncle", "the aunt", "the cousin", "the grandfather"]) },
    { lessonId: u6Lessons[2].id, orderIndex: 4, type: "translate", prompt: "Translate: the aunt", correctAnswer: "die Tante", options: JSON.stringify(["die Tante", "der Onkel", "die Cousine", "die Großmutter"]) },
    { lessonId: u6Lessons[2].id, orderIndex: 5, type: "fill", prompt: "Mein _____ ist alt. (My grandfather is old)", correctAnswer: "Großvater", options: JSON.stringify(["Großvater", "Vater", "Bruder", "Onkel"]) },
  ]);

  // UNIT 7: Colors & Clothes
  const u7 = insertedUnits[6].id;
  const u7Lessons = await db.insert(lessons).values([
    { unitId: u7, orderIndex: 1, title: "Colors", description: "Basic colors", type: "standard", xpReward: 10 },
    { unitId: u7, orderIndex: 2, title: "Clothing", description: "What to wear", type: "standard", xpReward: 10 },
    { unitId: u7, orderIndex: 3, title: "Descriptions", description: "Describe things", type: "standard", xpReward: 15 },
  ]).returning();

  await db.insert(questions).values([
    { lessonId: u7Lessons[0].id, orderIndex: 1, type: "translate", prompt: "Translate: red", correctAnswer: "rot", options: JSON.stringify(["rot", "blau", "grün", "gelb"]) },
    { lessonId: u7Lessons[0].id, orderIndex: 2, type: "translate", prompt: "Translate: blue", correctAnswer: "blau", options: JSON.stringify(["blau", "rot", "grün", "schwarz"]) },
    { lessonId: u7Lessons[0].id, orderIndex: 3, type: "match", prompt: "What color is 'grün'?", correctAnswer: "green", options: JSON.stringify(["green", "gray", "brown", "yellow"]) },
    { lessonId: u7Lessons[0].id, orderIndex: 4, type: "translate", prompt: "Translate: black", correctAnswer: "schwarz", options: JSON.stringify(["schwarz", "weiß", "grau", "braun"]) },
    { lessonId: u7Lessons[0].id, orderIndex: 5, type: "translate", prompt: "Translate: white", correctAnswer: "weiß", options: JSON.stringify(["weiß", "schwarz", "gelb", "grau"]) },
    { lessonId: u7Lessons[0].id, orderIndex: 6, type: "fill", prompt: "Die Sonne ist _____. (The sun is yellow)", correctAnswer: "gelb", options: JSON.stringify(["gelb", "rot", "orange", "weiß"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u7Lessons[1].id, orderIndex: 1, type: "translate", prompt: "Translate: the shirt", correctAnswer: "das Hemd", options: JSON.stringify(["das Hemd", "die Hose", "der Rock", "der Schuh"]) },
    { lessonId: u7Lessons[1].id, orderIndex: 2, type: "translate", prompt: "Translate: the pants", correctAnswer: "die Hose", options: JSON.stringify(["die Hose", "das Hemd", "der Rock", "die Jacke"]) },
    { lessonId: u7Lessons[1].id, orderIndex: 3, type: "match", prompt: "What does 'der Schuh' mean?", correctAnswer: "the shoe", options: JSON.stringify(["the shoe", "the sock", "the hat", "the belt"]) },
    { lessonId: u7Lessons[1].id, orderIndex: 4, type: "translate", prompt: "Translate: the jacket", correctAnswer: "die Jacke", options: JSON.stringify(["die Jacke", "das Kleid", "der Mantel", "das Hemd"]) },
    { lessonId: u7Lessons[1].id, orderIndex: 5, type: "fill", prompt: "Ich trage eine _____. (I wear a jacket)", correctAnswer: "Jacke", options: JSON.stringify(["Jacke", "Hose", "Hemd", "Schuh"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u7Lessons[2].id, orderIndex: 1, type: "translate", prompt: "Translate: big", correctAnswer: "groß", options: JSON.stringify(["groß", "klein", "alt", "neu"]) },
    { lessonId: u7Lessons[2].id, orderIndex: 2, type: "translate", prompt: "Translate: small", correctAnswer: "klein", options: JSON.stringify(["klein", "groß", "lang", "kurz"]) },
    { lessonId: u7Lessons[2].id, orderIndex: 3, type: "match", prompt: "What does 'schön' mean?", correctAnswer: "beautiful", options: JSON.stringify(["beautiful", "ugly", "big", "small"]) },
    { lessonId: u7Lessons[2].id, orderIndex: 4, type: "translate", prompt: "Translate: new", correctAnswer: "neu", options: JSON.stringify(["neu", "alt", "groß", "schön"]) },
    { lessonId: u7Lessons[2].id, orderIndex: 5, type: "fill", prompt: "Das Haus ist _____. (The house is old)", correctAnswer: "alt", options: JSON.stringify(["alt", "neu", "groß", "klein"]) },
  ]);

  // UNIT 8: Travel
  const u8 = insertedUnits[7].id;
  const u8Lessons = await db.insert(lessons).values([
    { unitId: u8, orderIndex: 1, title: "Transportation", description: "Bus, train, plane", type: "standard", xpReward: 10 },
    { unitId: u8, orderIndex: 2, title: "Directions", description: "Left, right, straight", type: "standard", xpReward: 10 },
    { unitId: u8, orderIndex: 3, title: "At the Hotel", description: "Booking a room", type: "standard", xpReward: 15 },
  ]).returning();

  await db.insert(questions).values([
    { lessonId: u8Lessons[0].id, orderIndex: 1, type: "translate", prompt: "Translate: the train", correctAnswer: "der Zug", options: JSON.stringify(["der Zug", "der Bus", "das Auto", "das Flugzeug"]) },
    { lessonId: u8Lessons[0].id, orderIndex: 2, type: "translate", prompt: "Translate: the airplane", correctAnswer: "das Flugzeug", options: JSON.stringify(["das Flugzeug", "der Zug", "das Schiff", "der Bus"]) },
    { lessonId: u8Lessons[0].id, orderIndex: 3, type: "match", prompt: "What does 'das Auto' mean?", correctAnswer: "the car", options: JSON.stringify(["the car", "the bus", "the train", "the bicycle"]) },
    { lessonId: u8Lessons[0].id, orderIndex: 4, type: "translate", prompt: "Translate: the bicycle", correctAnswer: "das Fahrrad", options: JSON.stringify(["das Fahrrad", "das Auto", "der Bus", "der Zug"]) },
    { lessonId: u8Lessons[0].id, orderIndex: 5, type: "fill", prompt: "Ich fahre mit dem _____. (I travel by train)", correctAnswer: "Zug", options: JSON.stringify(["Zug", "Auto", "Bus", "Fahrrad"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u8Lessons[1].id, orderIndex: 1, type: "translate", prompt: "Translate: left", correctAnswer: "links", options: JSON.stringify(["links", "rechts", "geradeaus", "zurück"]) },
    { lessonId: u8Lessons[1].id, orderIndex: 2, type: "translate", prompt: "Translate: right", correctAnswer: "rechts", options: JSON.stringify(["rechts", "links", "geradeaus", "oben"]) },
    { lessonId: u8Lessons[1].id, orderIndex: 3, type: "match", prompt: "What does 'geradeaus' mean?", correctAnswer: "straight ahead", options: JSON.stringify(["straight ahead", "turn around", "go back", "stop"]) },
    { lessonId: u8Lessons[1].id, orderIndex: 4, type: "translate", prompt: "Translate: Where is...?", correctAnswer: "Wo ist...?", options: JSON.stringify(["Wo ist...?", "Was ist...?", "Wer ist...?", "Wie ist...?"]) },
    { lessonId: u8Lessons[1].id, orderIndex: 5, type: "fill", prompt: "Gehen Sie _____. (Go straight ahead)", correctAnswer: "geradeaus", options: JSON.stringify(["geradeaus", "links", "rechts", "zurück"]) },
  ]);

  await db.insert(questions).values([
    { lessonId: u8Lessons[2].id, orderIndex: 1, type: "translate", prompt: "Translate: the room", correctAnswer: "das Zimmer", options: JSON.stringify(["das Zimmer", "das Hotel", "das Bett", "der Schlüssel"]) },
    { lessonId: u8Lessons[2].id, orderIndex: 2, type: "translate", prompt: "Translate: I have a reservation", correctAnswer: "Ich habe eine Reservierung", options: JSON.stringify(["Ich habe eine Reservierung", "Ich brauche ein Zimmer", "Ich suche ein Hotel", "Wo ist das Hotel?"]) },
    { lessonId: u8Lessons[2].id, orderIndex: 3, type: "match", prompt: "What does 'der Schlüssel' mean?", correctAnswer: "the key", options: JSON.stringify(["the key", "the door", "the room", "the bed"]) },
    { lessonId: u8Lessons[2].id, orderIndex: 4, type: "fill", prompt: "Ich brauche ein _____. (I need a room)", correctAnswer: "Zimmer", options: JSON.stringify(["Zimmer", "Schlüssel", "Hotel", "Bett"]) },
    { lessonId: u8Lessons[2].id, orderIndex: 5, type: "translate", prompt: "Translate: How much does it cost?", correctAnswer: "Wie viel kostet es?", options: JSON.stringify(["Wie viel kostet es?", "Wo ist es?", "Was ist das?", "Wann ist es?"]) },
  ]);

  // ============ ACHIEVEMENTS ============
  await db.insert(achievements).values([
    { key: "first_lesson", title: "First Steps", description: "Complete your first lesson", icon: "🎯", xpReward: 10, requirement: 1, category: "lessons" },
    { key: "five_lessons", title: "Getting Started", description: "Complete 5 lessons", icon: "📖", xpReward: 25, requirement: 5, category: "lessons" },
    { key: "ten_lessons", title: "Dedicated Learner", description: "Complete 10 lessons", icon: "🏆", xpReward: 50, requirement: 10, category: "lessons" },
    { key: "twenty_lessons", title: "Scholar", description: "Complete 20 lessons", icon: "🎓", xpReward: 100, requirement: 20, category: "lessons" },
    { key: "streak_3", title: "On Fire!", description: "Reach a 3-day streak", icon: "🔥", xpReward: 15, requirement: 3, category: "streak" },
    { key: "streak_7", title: "Week Warrior", description: "Reach a 7-day streak", icon: "⚡", xpReward: 50, requirement: 7, category: "streak" },
    { key: "streak_14", title: "Unstoppable", description: "Reach a 14-day streak", icon: "💪", xpReward: 100, requirement: 14, category: "streak" },
    { key: "streak_30", title: "Monthly Master", description: "Reach a 30-day streak", icon: "👑", xpReward: 200, requirement: 30, category: "streak" },
    { key: "xp_100", title: "XP Hunter", description: "Earn 100 XP", icon: "⭐", xpReward: 10, requirement: 100, category: "xp" },
    { key: "xp_500", title: "XP Master", description: "Earn 500 XP", icon: "🌟", xpReward: 50, requirement: 500, category: "xp" },
    { key: "xp_1000", title: "XP Legend", description: "Earn 1000 XP", icon: "💫", xpReward: 100, requirement: 1000, category: "xp" },
    { key: "perfect_score", title: "Perfectionist", description: "Get a perfect score on a lesson", icon: "💎", xpReward: 25, requirement: 1, category: "special" },
    { key: "first_unit", title: "Unit Complete!", description: "Complete all lessons in a unit", icon: "🏅", xpReward: 50, requirement: 1, category: "units" },
  ]);

  console.log("✅ Database seeded successfully!");
}
