target_url=dublin-development.icitywork.com

ROOT_DIR="$(dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )")"
OUTPUT_DIR=$ROOT_DIR/docs/web-archive

mkdir -p $OUTPUT_DIR

echo "Archiving $target_url to $OUTPUT_DIR"
# wget --no-clobber --recursive --no-host-directories --page-requisites -P $OUTPUT_DIR https://$target_url
wget --recursive --no-host-directories --page-requisites -P $OUTPUT_DIR https://$target_url

git stash push docs/web-archive/wp-content/uploads/2016/05/DublinSeal144x144.jpg
git stash push docs/web-archive/wp-content/uploads/2016/05/DublinSeal114x114.jpg
git stash push docs/web-archive/robots.txt docs/web-archive/index.html
git stash push docs/web-archive/robots.txt
