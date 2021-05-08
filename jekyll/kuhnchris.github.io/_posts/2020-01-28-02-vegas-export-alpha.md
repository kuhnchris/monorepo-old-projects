---
layout: post
title: Export Video with Alpha
tags: [Vegas]
categories: [Video Editing]
---

A short tutorial on exporting alpha-masked videos in Vegas Pro 15
<!--more-->

# Prepare 

Ensure you have your clip masked properly. Easiest would be to check during Fade-In/Fade-Out by adding a Solid Color Layer and check:

![Solid Color Layer](/static/img/2020-01-28-vegas-export-alpha-01.png)

![Check Fade-In/Out](/static/img/2020-01-28-vegas-export-alpha-02.png)

# Export

Export Settings: 
- Make sure you select 'Video for Windows'
- Select a profile with 'YUV'
- Select 'uncompressed'
- Check the export alpha checkbox

![Vegas Export Settings](/static/img/2020-01-28-vegas-export-alpha-03.png)

After export you get a big file. Convert that to something proper with ffmpeg.

# Transcode

```ffmpeg -i exportFile.avi -c:v libvpx -pix_fmt yuva420p -b:v 5000000 exportFile.webm```

# Result

<iframe src="/static/webm/cyogietyt.webm" width="320" height="180" frameborder="0" allowfullscreen></iframe>

# List of references

[unlisted udemy original](https://www.youtube.com/watch?v=sxVWYNS5-Oc)

[convert .avi/.mov to .webm](https://stackoverflow.com/questions/34856236/convert-mov-with-alpha-to-vp9-webm-with-alpha-using-ffmpeg)

[error: transparency-encoding with auto-alt-ref does not work](https://stackoverflow.com/questions/45588064/error-transparency-encoding-with-auto-alt-ref-does-not-work-when-converting-a)

* TOC
{:toc}
