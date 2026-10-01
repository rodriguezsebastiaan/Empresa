# Cinematic media optimization — Step 2

Date: 2026-09-30  
Scope: encode and measure candidate media only. No application integration or controller changes were made.

## FFmpeg environment

- FFmpeg: `C:\Users\juanm\Tools\bin\ffmpeg.exe`
- FFprobe: `C:\Users\juanm\Tools\bin\ffprobe.exe`
- Both `-version` checks succeeded. Build: `2026-09-28-git-84779ade26-essentials_build-www.gyan.dev` (essentials build).
- The build includes `libx264`, `libvpx-vp9`, SSIM and PSNR filters.
- Absolute executable paths were used; global PATH changes were unnecessary.

## Original media baseline

All seven `assets/videos/Video*.mp4` masters and their current `public/videos/cinematic/` copies were present. Each is 1920×1080, 24 fps, 6.000 seconds/144 frames, H.264 High Profile with AAC audio. Aggregate master size is **45,094,528 bytes (45.095 MB)**. The AAC streams are not used by the cinematic background.

The original keyframe inspection found two sparse-GOP clips: Video0 has keyframes at 0 and 4.000 seconds; Video3 has keyframes at 0 and approximately 4.542 seconds. The other five have only their initial keyframe during the six-second clip. This makes arbitrary seeking decode from a potentially distant earlier frame.

SHA-256 was recorded before encoding and rechecked after. All seven master hashes match; all seven production copy hashes also match their corresponding masters. Hashes are listed under [Final integrity check](#final-integrity-check).

## Encoding settings

Desktop and mobile H.264 use `libx264`, `medium`, CRF 22 and CRF 25 respectively, `yuv420p`, CFR 24, no audio, MP4 `+faststart`, fixed 12-frame GOP, scene cuts disabled, and closed GOP. Mobile scales the full frame to 1280×720 with Lanczos and square pixels. Both commands force a keyframe every 0.5 seconds in addition to the fixed GOP settings:

```text
ffmpeg -i INPUT -an -c:v libx264 -preset medium -crf 22 -pix_fmt yuv420p -r 24 -fps_mode cfr -g 12 -keyint_min 12 -sc_threshold 0 -x264-params keyint=12:min-keyint=12:scenecut=0:open-gop=0 -force_key_frames "expr:gte(t,n_forced*0.5)" -movflags +faststart OUTPUT.mp4
```

For mobile, the video filter was `scale=1280:720:flags=lanczos,setsar=1` and CRF was 25. No frame interpolation or crop was applied.

## Desktop H.264 results

All seven files probe as H.264, 1920×1080, 24/1 fps, 144 frames, 6.000 seconds, no audio, 12 keyframes, maximum observed keyframe interval 0.500 seconds. Full decode completed without errors.

## Mobile H.264 results

All seven files probe as H.264, 1280×720, 24/1 fps, 144 frames, 6.000 seconds, no audio, 12 keyframes, maximum observed keyframe interval 0.500 seconds. The 16:9 composition is preserved. Full decode completed without errors.

## Keyframe verification

Keyframe timestamps were read from decoded frame metadata with FFprobe after encoding. The desktop, mobile, and all four VP9 files have timestamps from 0 through 5.500 seconds in 0.500-second increments: 12 random-access frames and no interval above 0.500 seconds. These are measured timestamps, not inferred from encoder flags.

## File-size comparison

Sizes are decimal MB (bytes / 1,000,000). Average bitrate is a container-size estimate (`bytes × 8 ÷ 6 seconds`), not the video elementary-stream bitrate; source figures include AAC. Reduction is relative to the corresponding original file. Original keyframes summarize the six-second interval.

| Video | Variant | Codec | Resolution | FPS | Size (MB) | Avg. bitrate (Mb/s) | Audio | Keyframes | Max interval | Reduction vs original |
|---|---|---|---:|---:|---:|---:|---|---:|---:|---:|
| Video0 Galaxia | Original | H.264 | 1920×1080 | 24 | 3.936 | 5.248 | AAC | 2 | 4.000 s | — |
| Video0 Galaxia | Desktop | H.264 | 1920×1080 | 24 | 3.663 | 4.884 | No | 12 | 0.500 s | 6.95% |
| Video0 Galaxia | Mobile | H.264 | 1280×720 | 24 | 1.184 | 1.579 | No | 12 | 0.500 s | 69.91% |
| Video1 SistemaSolar | Original | H.264 | 1920×1080 | 24 | 5.498 | 7.330 | AAC | 1 | No second keyframe | — |
| Video1 SistemaSolar | Desktop | H.264 | 1920×1080 | 24 | 5.088 | 6.784 | No | 12 | 0.500 s | 7.45% |
| Video1 SistemaSolar | Mobile | H.264 | 1280×720 | 24 | 1.662 | 2.216 | No | 12 | 0.500 s | 69.77% |
| Video2 Colombia | Original | H.264 | 1920×1080 | 24 | 11.068 | 14.758 | AAC | 1 | No second keyframe | — |
| Video2 Colombia | Desktop | H.264 | 1920×1080 | 24 | 9.423 | 12.564 | No | 12 | 0.500 s | 14.86% |
| Video2 Colombia | Mobile | H.264 | 1280×720 | 24 | 2.973 | 3.963 | No | 12 | 0.500 s | 73.14% |
| Video3 Col_Iceberg | Original | H.264 | 1920×1080 | 24 | 7.441 | 9.922 | AAC | 2 | 4.542 s | — |
| Video3 Col_Iceberg | Desktop | H.264 | 1920×1080 | 24 | 6.377 | 8.502 | No | 12 | 0.500 s | 14.31% |
| Video3 Col_Iceberg | Mobile | H.264 | 1280×720 | 24 | 2.258 | 3.010 | No | 12 | 0.500 s | 69.66% |
| Video4 PuntaIceberg | Original | H.264 | 1920×1080 | 24 | 4.949 | 6.599 | AAC | 1 | No second keyframe | — |
| Video4 PuntaIceberg | Desktop | H.264 | 1920×1080 | 24 | 4.459 | 5.945 | No | 12 | 0.500 s | 9.90% |
| Video4 PuntaIceberg | Mobile | H.264 | 1280×720 | 24 | 1.503 | 2.004 | No | 12 | 0.500 s | 69.62% |
| Video5 IcebergAbajo | Original | H.264 | 1920×1080 | 24 | 5.984 | 7.979 | AAC | 1 | No second keyframe | — |
| Video5 IcebergAbajo | Desktop | H.264 | 1920×1080 | 24 | 5.312 | 7.082 | No | 12 | 0.500 s | 11.24% |
| Video5 IcebergAbajo | Mobile | H.264 | 1280×720 | 24 | 1.746 | 2.328 | No | 12 | 0.500 s | 70.82% |
| Video6 IcebergCompleto | Original | H.264 | 1920×1080 | 24 | 6.218 | 8.290 | AAC | 1 | No second keyframe | — |
| Video6 IcebergCompleto | Desktop | H.264 | 1920×1080 | 24 | 5.726 | 7.634 | No | 12 | 0.500 s | 7.92% |
| Video6 IcebergCompleto | Mobile | H.264 | 1280×720 | 24 | 1.878 | 2.504 | No | 12 | 0.500 s | 69.80% |
| Video2 Colombia | VP9 CRF 32 | VP9 | 1920×1080 | 24 | 8.877 | 11.836 | No | 12 | 0.500 s | 19.80% |
| Video2 Colombia | VP9 CRF 25 | VP9 | 1920×1080 | 24 | 14.036 | 18.715 | No | 12 | 0.500 s | −26.85% |
| Video4 PuntaIceberg | VP9 CRF 32 | VP9 | 1920×1080 | 24 | 3.309 | 4.412 | No | 12 | 0.500 s | 33.13% |
| Video4 PuntaIceberg | VP9 CRF 25 | VP9 | 1920×1080 | 24 | 5.244 | 6.991 | No | 12 | 0.500 s | −5.93% |

Desktop H.264 totals **40,047,203 bytes (40.047 MB)**, an **11.19%** reduction from the original aggregate. Mobile totals **13,203,441 bytes (13.203 MB)**, a **70.72%** reduction. The largest original, Video2 Colombia, falls from 11.068 MB to 9.423 MB desktop and 2.973 MB mobile.

## Visual-quality observations

Extracted and reviewed representative frames at 1, 3, and 5 seconds for each source and its desktop/mobile encodes. Temporary comparison sheets and frame extracts were removed after review. Desktop H.264 retained the sampled star fields, dark gradients, clouds, water, iceberg texture, and cyan lighting without obvious blocking or banding. Mobile showed expected scaling softness while retaining the complete frame and the sampled details.

Full-clip SSIM (original compared with encoded output; mobile comparison first scales the original to 720p):

| Video | Desktop H.264 SSIM | Mobile H.264 SSIM |
|---|---:|---:|
| Video0 | 0.994299 | 0.985914 |
| Video1 | 0.992726 | 0.983982 |
| Video2 | 0.986714 | 0.973460 |
| Video3 | 0.990377 | 0.981017 |
| Video4 | 0.990717 | 0.982094 |
| Video5 | 0.990268 | 0.980670 |
| Video6 | 0.990421 | 0.979186 |

VMAF averages were 97.58 for desktop H.264 Video2 and 97.00 for Video4. These metrics support the sampled visual review; they do not replace it.

## VP9 experiment

The representative clips were Video2 Colombia (high complexity/largest source) and Video4 PuntaIceberg (lower complexity). Two quality levels were encoded with `libvpx-vp9`, 1920×1080, 24 fps, no audio, constant-quality mode (`-b:v 0`), zero frame lag/alt-ref, and 12-frame maximum GOP. Both CRF 32 and CRF 25 outputs pass the 0.500-second keyframe check.

At CRF 32, Video2 is only 5.8% smaller than its desktop H.264 counterpart and Video4 is 25.8% smaller. Full-clip SSIM is 0.9191 / 0.9473 (Video2 / Video4), and VMAF is 70.83 / 68.71. At CRF 25, VP9 is larger than H.264 on both clips (Video2 14.036 vs 9.423 MB; Video4 5.244 vs 4.459 MB); SSIM is 0.9225 / 0.9490 and VMAF 72.26 / 70.11. Sampled VP9 frames looked close to the source, but the much lower full-clip metrics conflict with that impression. Treat the VP9 quality comparison as inconclusive and do not promote VP9 on these measurements.

## Seek experiment

Ran five FFmpeg arbitrary-seek decode checks at 0.70, 1.35, 2.80, 4.20, and 5.60 seconds on both representative originals and every corresponding desktop/mobile H.264 and VP9 sample. All seeks decoded successfully. Times below are median/max process wall time over those five checks, including FFmpeg process startup and local cache effects:

| Clip | Original | Desktop H.264 | Mobile H.264 | VP9 CRF32 | VP9 CRF25 |
|---|---:|---:|---:|---:|---:|
| Video2 Colombia | 420 / 573 ms | 223 / 237 ms | 134 / 146 ms | 237 / 279 ms | 276 / 297 ms |
| Video4 PuntaIceberg | 289 / 417 ms | 173 / 285 ms | 118 / 122 ms | 159 / 203 ms | 167 / 182 ms |

This local CLI experiment shows lower seek/decode cost for short-GOP H.264 on Video2 and Video4, with lower-resolution mobile files fastest. VP9 was slower than H.264 on Video2; Video4 was close. It is not a browser seek API test and does not establish scroll smoothness.

## Recommended runtime media strategy

- **Desktop primary:** H.264 MP4. It provides broad browser support, verified 0.5-second random-access spacing, good full-clip quality metrics, and measured payload reduction over the originals.
- **Desktop fallback:** H.264 MP4. It is also the primary format here, so a separate fallback source is unnecessary unless Step 3 later adds another codec. Do not use VP9 as preferred source from this experiment: CRF 32's size advantage came with materially weaker sequence metrics, while CRF 25 was larger.
- **Mobile:** H.264 MP4 at 1280×720. The measured aggregate is 70.72% smaller than the original set, preserving 16:9 and 24 fps.
- **Desktop resolution:** 1920×1080 to preserve current source detail and framing.
- **GOP:** 12 frames / 0.500 seconds at 24 fps; this was verified from actual timestamps for every output.

## Assets generated

Desktop H.264:

- `public/videos/cinematic/optimized/desktop/video0_Galaxia_h264.mp4`
- `public/videos/cinematic/optimized/desktop/video1_SistemaSolar_h264.mp4`
- `public/videos/cinematic/optimized/desktop/video2_Colombia_h264.mp4`
- `public/videos/cinematic/optimized/desktop/video3_Col_Iceberg_h264.mp4`
- `public/videos/cinematic/optimized/desktop/video4_PuntaIceberg_h264.mp4`
- `public/videos/cinematic/optimized/desktop/video5_IcebergAbajo_h264.mp4`
- `public/videos/cinematic/optimized/desktop/video6_IcebergCompleto_h264.mp4`

Mobile H.264:

- `public/videos/cinematic/optimized/mobile/video0_Galaxia_720p_h264.mp4`
- `public/videos/cinematic/optimized/mobile/video1_SistemaSolar_720p_h264.mp4`
- `public/videos/cinematic/optimized/mobile/video2_Colombia_720p_h264.mp4`
- `public/videos/cinematic/optimized/mobile/video3_Col_Iceberg_720p_h264.mp4`
- `public/videos/cinematic/optimized/mobile/video4_PuntaIceberg_720p_h264.mp4`
- `public/videos/cinematic/optimized/mobile/video5_IcebergAbajo_720p_h264.mp4`
- `public/videos/cinematic/optimized/mobile/video6_IcebergCompleto_720p_h264.mp4`

VP9 experiment:

- `docs/performance/step2-evidence/vp9/video2_Colombia_vp9.webm`
- `docs/performance/step2-evidence/vp9/video2_Colombia_vp9_crf25.webm`
- `docs/performance/step2-evidence/vp9/video4_PuntaIceberg_vp9.webm`
- `docs/performance/step2-evidence/vp9/video4_PuntaIceberg_vp9_crf25.webm`

These experimental outputs are retained as reproducibility evidence outside `public/`; the application does not serve or reference them.

## Final integrity check

Full-file decode checks succeeded for all 18 generated video assets. FFprobe confirms every output is 6.000 seconds at 24 fps, with the expected resolution and no audio. Original master hashes after processing:

| Master | SHA-256 |
|---|---|
| Video0_Galaxia.mp4 | `9A732C89619B714D23CFBEE2BCACC9B6C578202ACD27280EB43277324896F2D8` |
| Video1_SistemaSolar.mp4 | `1F1149D164000E318C72D7065B3CAC52F6BE4E5A9643A15A8CAD05DB8D8A91ED` |
| Video2_Colombia.mp4 | `A5597F7BF1C15217CA01A03A66579E21871160253D06893F7E1E342558CC227A` |
| Video3_Col_Iceberg.mp4 | `EAA10747C6C588F60A407D29A896B84FE9A1A3FCF6953BF6A2EE8C5A759155A9` |
| Video4_PuntaIceberg.mp4 | `4A809CC775BFC321DC2A5B4CC5CDC25165CB4DEE5CD3B74E83B15964893A8802` |
| Video5_IcebergAbajo.mp4 | `A6F72D9E91F4FD3C5265824FCFC9E3D00AA5A9CD2EFD233CF2BCDAEDE7FBF8A7` |
| Video6_IcebergCompleto.mp4 | `BA25613DE655D082AA75EC5B85DFCA53FE1C41C66A1CE7739FEDC3B0C35E1F69` |

The current production video copies still hash-identically to their corresponding master sources. No application source file was written during this step. Existing unrelated worktree changes were present and left untouched.

## Issues or limitations encountered

- The first VP9 CRF 32 run did not provide sufficient full-sequence quality according to SSIM/VMAF despite close-looking sampled frames. A CRF 25 comparison was added; it costs more bytes than H.264 and does not remove that metric discrepancy.
- Seek timings are local FFmpeg process measurements, not browser measurements. Browser buffering, demuxing, decoder behavior, and scroll controller behavior remain to be measured during integration.
- No optimized asset has been integrated into the application. Step 3 remains outstanding.

