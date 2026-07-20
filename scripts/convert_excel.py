"""
前年比.xlsx -> src/data/churches.json への変換スクリプト
再現用。実行: python3 convert_excel.py <input.xlsx> <output_dir>
"""
import sys, json, openpyxl
from collections import defaultdict

def main(xlsx_path, out_dir):
    wb = openpyxl.load_workbook(xlsx_path, data_only=True)
    ws_master = wb['教会マスタ']
    ws_perf = wb['教会実績']

    master_rows = list(ws_master.iter_rows(min_row=2, values_only=True))
    perf_rows = list(ws_perf.iter_rows(min_row=2, values_only=True))

    churches = {}
    order = []
    for row in master_rows:
        if not row or row[0] is None:
            continue
        key, full_name, total_members, size, region = row
        cid = key.split('_')[0]
        order.append(cid)
        churches[cid] = {
            "id": cid,
            "key": key,
            "name": full_name,
            "region": region,
            "size": size,
            "totalMembers": None if total_members in (None, '-', '') else int(total_members),
            "kpi": defaultdict(lambda: {"total": {"y2025": 0, "y2026": 0},
                                          "男": {"y2025": 0, "y2026": 0},
                                          "女": {"y2025": 0, "y2026": 0}})
        }

    for row in perf_rows:
        if not row or row[0] is None:
            continue
        key, year, gender, kpi, count = row
        cid = key.split('_')[0]
        if cid not in churches:
            continue
        ykey = f"y{int(year)}"
        count = int(count) if count is not None else 0
        bucket = churches[cid]["kpi"][kpi]
        bucket[gender][ykey] += count
        bucket["total"][ykey] += count

    result = []
    for cid in order:
        c = churches[cid]
        c["kpi"] = {k: v for k, v in c["kpi"].items()}
        result.append(c)

    with open(f"{out_dir}/churches.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(result)} churches to {out_dir}/churches.json")

if __name__ == "__main__":
    xlsx_path = sys.argv[1] if len(sys.argv) > 1 else "前年比.xlsx"
    out_dir = sys.argv[2] if len(sys.argv) > 2 else "../src/data"
    main(xlsx_path, out_dir)
