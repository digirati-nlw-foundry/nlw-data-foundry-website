---
dataset_id: "welsh-newspapers-entities"
title: "Welsh Newspapers Entity Explorer"
description: "A sample AI-assisted dataset connecting newspaper records with people, places, and organisations mentioned in OCR text."
featured: true
featuredOrder: 3
accent: "#6b4ab6"
tags:
  - "AI/ML"
  - "Newspapers"
  - "Entities"
institutions:
  - "The National Library of Wales"
rights: "See source collection rights before bulk reuse."
team: "National Library of Wales"
updated: "Updated 20 March 2026"
---

## Overview

This sample dataset contains derived entity records generated from OCR text in a subset of Welsh Newspapers content and reviewed for demonstration use in the Foundry. It was created by a pilot processing workflow led by the National Library of Wales with technical support from project collaborators.

- Creation date: 30 May 2025
- Size: 18 MB
- Formats: CSV
- Languages: English, Welsh
- Publisher: The National Library of Wales
- Publication date: 20 March 2026

## Source

The source material comes from OCR text captured from Welsh Newspapers pages. A pilot enrichment workflow extracted candidate entities and editorial notes explaining confidence and limitations.

## Version history

- `v0.9` — 20 March 2026: Pilot release published for evaluation and interface testing.

## Rights and reuse

This pilot includes machine-assisted outputs. Review confidence notes and source context before making public claims or automated decisions.

Suggested citation:

`National Library of Wales. Welsh Newspapers Entity Explorer. v0.9. The National Library of Wales. 2026. /en/data/welsh-newspapers-entities.`

Contact: [Contact the Enquiries Service](mailto:enquiry@library.wales)

## Access

- `CSV`, `2 KB`, `v0.9`: [Entity explorer sample](/downloads/welsh-newspapers-entities-v0.9.csv)

## Processing methods

- **OCR post-processing** using **Pattern cleanup**: Common OCR noise patterns were normalised before named-entity extraction. Confidence: medium.
- **Named-entity recognition** using **Pilot enrichment workflow**: Entity suggestions were retained only where the editorial workflow could attach provenance notes. Confidence: medium.

## Data preview

The preview shows how extracted entities are linked back to newspaper issues and confidence notes.

| Issue        | Entity             | Type         | Confidence |
| ------------ | ------------------ | ------------ | ---------- |
| WNP-1901-001 | Aberystwyth        | Place        | 0.92       |
| WNP-1901-002 | David Lloyd George | Person       | 0.78       |
| WNP-1901-003 | Cambrian News      | Organisation | 0.84       |

## Search and filter

Search indexes this record under AI/ML and newspaper-related terms so users can separate enriched datasets from manual transcriptions.
