---
layout: post
title: SEGW Permission for seeing projects
tags: [SAP, ABAP, SEGW, FIORI]
categories: [SAP]
---

Quick Info

<!--more-->

# Issue

Sometimes, on some customer systems, you do not see any projects in ```SEGW``` (neither ```Z*``` nor any projects). You can see generated ```*_MPC_EXT``` and ```*_DPC_EXT``` classes in T-Code ```SE24``` (and edit those).

# Check

- Go to ```SEGW```, click on "Open Project", try the F4 help.
- Check ```SU53```
- See following:
```
Datum 29.01.2020 Uhrzeit 12:41:39 Transaktion SEGW
  Berechtigungsobjekt /IWBEP/SB  Berechtigung für den SAP Gateway Service Builder
    Berechtigungsfeld dummyfield                                                                           <DUMMY>
```

# Solution

Get yourself the permission object ```/IWBEP/SB```.


* TOC
{:toc}
