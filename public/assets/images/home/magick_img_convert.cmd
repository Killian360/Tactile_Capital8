magick mogrify -quality 80 -path ./compressJPG -format jpg *.jpg*
magick mogrify -quality 60 -path ./compressWebP -format webp *.jpg*
REM magick mogrify -resize 45%% -quality 90 -path ./medium -format jpg *.jpg*
REM magick mogrify -resize 30%% -quality 80 -path ./small -format webp *.jpg*
REM magick mogrify -resize 30%% -quality 90 -path ./small -format jpg *.jpg*
