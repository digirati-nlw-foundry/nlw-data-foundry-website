---
dataset_id: "peace-petition-annotations"
title: "Welsh Women's Peace Petition Annotations"
description: "A structured annotation dataset linking IIIF images, extracted entities, and volunteer review notes from the Welsh Women's Peace Petition."
featured: true
featuredOrder: 2
accent: "#0f6c75"
tags:
  - "IIIF"
  - "Annotations"
  - "Peace Petition"
institutions:
  - "The National Library of Wales"
rights: "CC BY 4.0"
team: "Digital Collections Team"
updated: "Updated 20 March 2026"
---

## Overview

This dataset combines annotation records derived from IIIF manifests with transcription work undertaken around the Welsh Women's Peace Petition collection. It was prepared by National Library of Wales staff with volunteer contributions and reviewed for structured publication in the Foundry.

- Creation date: 12 December 2024
- Size: 12 MB
- Formats: JSON
- Languages: English, Welsh
- Publisher: The National Library of Wales
- Publication date: 20 March 2026

## Source

This dataset combines image-derived annotation structures with transcribed and reviewed descriptive fields to support search, reuse, and exhibition work around the petition.

## Version history

- `v1.0` — 15 January 2025: Initial structured annotation export.
- `v1.2` — 20 March 2026: Added entity review notes, IIIF manifest reference, and clearer provenance metadata.

## Rights and reuse

Credit the Digital Collections Team and retain provenance references when reusing annotations or exported entities.

Suggested citation:

`Digital Collections Team. Welsh Women's Peace Petition Annotations. v1.2. The National Library of Wales. 2026. /en/data/peace-petition-annotations.`

Contact: [Contact the Enquiries Service](mailto:enquiry@library.wales)

## Access

- `JSON`, `4 KB`, `v1.2`: [Annotation export](/downloads/peace-petition-annotations-v1.2.json)

## IIIF

This record links to an IIIF manifest used in exhibition and annotation workflows.

- [Open IIIF manifest](https://datasyllwr.llgc.org.uk/manifests/PeacePetition/loc/manifests/6085440-manifest.json)

## Processing methods

- **Entity extraction** using **Editorial review workflow**: Named entities were normalised before export and flagged for manual review where confidence was uncertain. Confidence: varies by field.
- **Image linking** using **IIIF manifest alignment**: Annotation identifiers retain their source canvas references for downstream reuse.

## Search and filter

Search results expose this dataset under both annotation and peace-petition tags.

Example query: `peace petition annotations`
