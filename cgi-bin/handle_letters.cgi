#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import cgi
from spel import Galgje
get_phase = Galgje.get_phase;

# Lees data verstuurd door JavaScript
parameters = cgi.FieldStorage();
data = json.loads(parameters.getvalue('data'));
clicked = data["clicked"];
pattern = data["pattern"];
phase = data["phase"];
letter = parameters.getvalue('waarde');

# Bereken te verzenden data
galgje = Galgje();
new_pattern, _ = galgje.set_candidates(pattern, clicked, letter);
pattern, phase = get_phase(pattern, new_pattern, phase);
nieuwe_data = {"pattern": pattern, "phase": phase}
if letter in clicked:
    nieuwe_data = {"error": "letter is al geraden"}
print(nieuwe_data)

# Stuur antwoord terug
print("Content-Type: application/json")
print()
print(json.dumps(nieuwe_data))
