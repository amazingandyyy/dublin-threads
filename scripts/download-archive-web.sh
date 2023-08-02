from_year=2015
# current_year=$(date +"%Y")
current_year=2017
target_url=dublin-development.icitywork.com

ROOT_DIR="$(dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )")"
OUTPUT_DIR=$ROOT_DIR/docs/archive-developments/

mkdir -p $OUTPUT_DIR

# DOCS:     https://github.com/jsvine/waybackpack
# PREPARE:  pip install waybackpack tqdm
# NOTES:    needs tqdm for progress bar
waybackpack --no-clobber --follow-redirects --progress https://$target_url --list > $OUTPUT_DIR/list.txt
waybackpack --no-clobber --follow-redirects --raw --progress https://$target_url -d $OUTPUT_DIR --from-date $from_year --to-date $current_year
