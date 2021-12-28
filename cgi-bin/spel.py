import random


class Galgje:
    LETTERS = list('ABCDEFGHIJKLMNOPQRSTYVWXYZ')
    with open('woorden.txt') as data:
        words = data.read().splitlines()

    def __init__(self):
        self.available = self.LETTERS
        self.pattern = None
        self.length = None
        self.candidates = None

    def create_candidates(self):
        word = self.words[random.randrange(0, len(self.words), 1)]
        self.length = len(word)
        self.candidates = [i for i in self.words if len(i) == self.length]
        self.pattern = ''.join('_' for _ in range(self.length))

    def set_candidates(self, progress, used, letter):
        patterns = dict()
        used = ''.join(i.upper() for i in used)
        candidates = [i for i in self.words if self.candidate(i, progress, used)]
        for c in candidates:
            pattern = self.fill(c, progress, letter)
            if pattern not in patterns.keys():
                patterns[pattern] = [c]
            else:
                patterns[pattern].append(c)
        max_val = max(len(v) for v in patterns.values())
        most = [key for key, value in patterns.items() if len(value) == max_val][0]
        word = random.choice(patterns.get(most))
        return self.fill(word, progress, letter), word

    @staticmethod
    def add_to_list(lijst, item):
        return lijst + [item] if item not in lijst else lijst

    @staticmethod
    def get_phase(pattern, new_pattern, phase):
        return pattern if pattern == new_pattern else new_pattern, phase + 1 if pattern == new_pattern else phase

    @staticmethod
    def candidate(word, progress, used):
        if len(word) != len(progress):
            return False
        for i, char in enumerate(word):
            if char in used:
                if char != progress[i]:
                    return False
            else:
                if progress[i] != '_':
                    return False
        return True

    @staticmethod
    def fill(word, progress, letter):
        return ''.join([i if i == letter else progress[x] for x, i in enumerate(word)])
