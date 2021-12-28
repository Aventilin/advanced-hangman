#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import cgi
from spel import Galgje

# Lees data verstuurd door JavaScript
parameters = cgi.FieldStorage();
data = json.loads(parameters.getvalue('data'));
waarde = parameters.getvalue('waarde');

# Bereken te verzenden data
galgje = Galgje();
galgje.create_candidates();
pattern = galgje.pattern;
nieuwe_data = {"pattern": pattern}
print(nieuwe_data)

# Stuur antwoord terug
print("Content-Type: application/json")
print()
print(json.dumps(nieuwe_data))
