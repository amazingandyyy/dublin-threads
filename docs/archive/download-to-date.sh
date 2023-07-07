current_year=$(date +"%Y")
target_url=dublin-development.icitywork.com

CURRNT_DIR="$(dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )")"
OUTPUT_DIR=$CURRNT_DIR/archive.org

mkdir -p $OUTPUT_DIR

# https://github.com/jsvine/waybackpack
# pip install waybackpack tqdm
waybackpack --no-clobber --follow-redirects --progress https://$target_url -d $OUTPUT_DIR --from-date 2019 --to-date 2024
# waybackpack --no-clobber --follow-redirects --progress https://$target_url --list
