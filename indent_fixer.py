import json
import re

def beautify_c_code(code):
    lines = code.split('\n')
    final_lines = []
    indent = 0
    for line in lines:
        stripped = line.strip()
        if not stripped:
            final_lines.append("")
            continue
            
        # Braces counting for proper indentation
        # Decrease indent BEFORE the line if it starts with }
        # or contains more } than { at the beginning
        
        # A more robust approach for braces:
        # 1. Count { and } in the line
        # 2. If line starts with }, temporary decrease indent for this line
        # 3. Update global indent for NEXT line
        
        opening = stripped.count('{')
        closing = stripped.count('}')
        
        # Adjust current line indent
        current_indent = indent
        if stripped.startswith('}'):
            current_indent -= 1
        # Also handle cases like "} else {" or "} catch (...) {"
        elif stripped.startswith('else') or stripped.startswith('catch'):
            # Just to be sure, but usually '}' would precede them
            pass
            
        final_lines.append("    " * max(0, current_indent) + stripped)
        
        # Update indent for next line
        indent += opening
        indent -= closing
        
    return "\n".join(final_lines)

def process():
    with open('src/data/labContent.ts', 'r') as f:
        content = f.read()

    start_marker = "export const cdLabData: LabExperiment[] = ["
    end_pattern = r'\];\s*export const recordLabData'
    end_match = re.search(end_pattern, content, re.DOTALL)
    
    if not end_match: return

    start_idx = content.find(start_marker)
    if start_idx == -1: return

    json_part = content[start_idx + len(start_marker) - 1 : end_match.start() + 1]
    data = json.loads(json_part)

    for item in data:
        item['code'] = beautify_c_code(item['code'])

    new_json_part = json.dumps(data, indent=2)
    new_content = content[:start_idx + len(start_marker) - 1] + new_json_part + content[end_match.start() + 1:]
    
    with open('src/data/labContent.ts', 'w') as f:
        f.write(new_content)

if __name__ == "__main__":
    process()
