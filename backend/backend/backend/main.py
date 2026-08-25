import os
import json
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="如意 Ruyi AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_BASE = os.getenv("FREEBUFF_API_BASE", "https://api.freebuff.com/v1")
API_KEY = os.getenv("BIGMODEL_API_KEY", "")
MODEL = os.getenv("MODEL", "minimax/minimax-m2.7")

class QueryRequest(BaseModel):
    query: str

SYSTEM_PROMPT = """你是「如意 AI」，一个专业的任务拆解助手。

用户会告诉你他们想做什么，你需要：
1. 理解用户的目标
2. 将目标拆解为可执行的步骤
3. 评估完成任务的信心程度

请严格返回以下 JSON 格式（不要包含任何其他文字，只返回 JSON）：
{
  "goal": "用户的核心目标（一句话概括）",
  "deliverable": {
    "type": "计划/方案/文案/报告等",
    "format": "步骤清单/表格/草稿/文档等"
  },
  "constraints": {
    "audience": "目标受众",
    "tone": "专业/友好/正式等语气"
  },
  "steps": ["步骤1的具体内容", "步骤2的具体内容", "步骤3的具体内容"],
  "confidence": 0.85,
  "note": "简短的补充说明"
}"""

def get_mock_response(query: str) -> dict:
    return {
        "goal": f"帮助用户完成：{query}",
        "deliverable": {"type": "结构化执行方案", "format": "步骤清单 + 详细说明"},
        "constraints": {"audience": "面向普通用户", "tone": "专业、友好、清晰"},
        "steps": ["分析需求：明确目标和关键要素", "制定计划：拆解为可执行的具体步骤", "执行落地：按步骤逐一完成", "检查复盘：验证结果并总结经验"],
        "confidence": 0.85,
        "note": "模拟响应（请配置 API Key 以获得真实 AI 分析）"
    }

@app.get("/")
async def root():
    return {"message": "如意 Ruyi AI API", "status": "running"}

@app.post("/api/ruyi")
async def ruyi_analyze(request: QueryRequest):
    if not API_KEY:
        return get_mock_response(request.query)
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{API_BASE}/chat/completions",
                headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
                json={
                    "model": MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": request.query}
                    ],
                    "temperature": 0.7,
                    "response_format": {"type": "json_object"}
                }
            )
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            return json.loads(content)
    except Exception as e:
        return {"error": str(e), "message": "AI 分析失败，返回模拟数据", **get_mock_response(request.query)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
